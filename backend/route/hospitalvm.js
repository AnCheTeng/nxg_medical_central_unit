var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var HospitalVM = require('../model/HospitalVM');
var iprequest = require('request');

var router = express.Router();
var parseUrlencoded = bodyParser.urlencoded({
  extended: false
});


mongoose.createConnection('mongodb://localhost/central');

router.route('/')
  .get(parseUrlencoded, function(request, response) {
    HospitalVM.find().exec(function(err, result) {
      response.send(result);
    })
  });

router.route('/load/:address')
  .get(parseUrlencoded, function(request, response) {
    var ip_addr = request.params.address;
    console.log(ip_addr);
    var complete_url = "http://"+ip_addr+":8080/physical";
    console.log(complete_url);
    HospitalVM.findOne({IP:ip_addr}).exec(function(err, result) {
      if(!result){
        console.log("Can't find");
        iprequest.get({
          url: complete_url
        }, function(err, res, body){
          console.log(body);
          body = JSON.parse(body);
          if(body.name){
            console.log(body.name);
            var newMember = new HospitalVM({
              IP: ip_addr,
              name: body.name
            });

            newMember.save();
            response.send(newMember);

          } else {
            response.send(false);
            response.end();
          }
        });

      } else {
        response.send(result);
      }
    })
  });

router.route('/list')
  .get(parseUrlencoded, function(request, response) {
    HospitalVM.find().exec(function(err, VMlist){
      var HospitalList = VMlist.map(function(hosp) {
        return hosp.name;
      })
      response.send(HospitalList);
    });
  });

router.route('/analysis')
  .get(parseUrlencoded, function(request, response) {
    var temparray = {
      blood: [],
      patient: [],
    };
    HospitalVM.find().exec(function(err, VMlist){
      console.log(VMlist);
      for (var i=0, length=VMlist.length; i<length; i++) {
        var complete_url="http://"+VMlist[i].IP+":8080/blood/number/O"
        console.log(complete_url);
        console.log(VMlist[i].name);
        var hopname = VMlist[i].name;
        // Blood
        iprequest.get({
          url:complete_url
        }, function(err, res, body){
          body = JSON.parse(body);
          console.log(body.number);
          if(body.number<150) {
            console.log(hopname+"之O型血量庫存為"+body.number+"，已低於50%，請從鄰近醫院補充。");
            temparray.blood.push(hopname+"之O型血量庫存為"+body.number+"，已低於50%，請從鄰近醫院補充。");
          } else {
            console.log(hopname+"之O型血量庫存為"+body.number+"，可供給其他醫院進行協助。");
            temparray.blood.push(hopname+"之O型血量庫存為"+body.number+"，可供給其他醫院進行協助。");
          }

          if(temparray.blood.length==3 && temparray.patient.length==3){
            respopnse.send(temparray);
          }
        });
      }

      for (var i=0, length=VMlist.length; i<length; i++) {
        var complete_url="http://"+VMlist[i].IP+":8080/sickbed/number/ICU"
        console.log(complete_url);
        console.log(VMlist[i].name);
        var hostname = VMlist[i].name;
        // Blood
        iprequest.get({
          url:complete_url
        }, function(err, res, body){
          body = JSON.parse(body);
          console.log(body.number);
          if(body.number<2) {
            console.log("緊急！！！！"+hostname+"之加護病床床位剩餘"+body.number+"床，為數不多，請勿再送病患進來！")
            temparray.patient.push("緊急！！！！"+hostname+"之加護病床床位剩餘"+body.number+"床，為數不多，請勿再送病患進來！");
          } else {
            console.log(hostname+"之加護病床床位剩餘"+body.number+"，還可接受需要加護病房之病患。");
            temparray.patient.push(hostname+"之加護病床床位剩餘"+body.number+"，還可接受需要加護病房之病患。");
          }

          if(temparray.blood.length==3 && temparray.patient.length==3){
            respopnse.send(temparray);
          }

        });
      }
    });
  });

router.route('/renew')
  .get(parseUrlencoded, function(request, response) {
    HospitalVM.find().exec(function(vmlist){
      for (var i=0, leng=vmlist.length; i<leng; i++) {
        var complete_url="http://"+vmlist[i].IP+":8080/physical";
        iprequest.get({
          url:complete_url
        }, function(err, res, body){
          body = JSON.parse(body);
          vmlist[i].name = body.name;
          vmlist[i].save();
        });
      }
      response.end();
    });
  });

router.route('/deleteAll')
  .get(parseUrlencoded, function(request, response) {
    HospitalVM.remove({}, function(){
      response.end();
    });
  });

module.exports = router;
