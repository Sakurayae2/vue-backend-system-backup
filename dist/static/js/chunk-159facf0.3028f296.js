(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-159facf0"],{8196:function(t,a,e){},"9f5c":function(t,a,e){"use strict";e("8196")},"9f71":function(t,a,e){"use strict";e.d(a,"c",(function(){return n})),e.d(a,"b",(function(){return r})),e.d(a,"a",(function(){return s}));var i=e("b775");function n(t){return Object(i["a"])({url:"/api/pwapi/manage/user/compare/rank",method:"get",params:t})}function r(t){return Object(i["a"])({url:"api/pwapi/manage/update/twouser/comparescore",method:"get",params:t})}function s(t){return Object(i["a"])({url:"/api/pwapi/manage/user/images",method:"get",params:t})}},ef74:function(t,a,e){"use strict";e.r(a);var i=function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("div",{staticClass:"main"},[e("div",{staticClass:"left"},[e("div",{staticStyle:{padding:"10px 0 20px 0","text-align":"center"}},[t._v(" "+t._s(t.mainname)+" "+t._s(t.mainuin)+" ")]),e("table",t._l(t.avatorList1,(function(a,i){return i%5==0?e("tr",{key:i},[e("td",[e("el-image",{staticStyle:{width:"150px",height:"200px"},attrs:{src:t.avatorList1[i]}})],1),e("td",[e("el-image",{staticStyle:{width:"150px",height:"200px"},attrs:{src:t.avatorList1[i+1]}})],1),e("td",[e("el-image",{staticStyle:{width:"150px",height:"200px"},attrs:{src:t.avatorList1[i+2]}})],1),e("td",[e("el-image",{staticStyle:{width:"150px",height:"200px"},attrs:{src:t.avatorList1[i+3]}})],1),e("td",[e("el-image",{staticStyle:{width:"150px",height:"200px"},attrs:{src:t.avatorList1[i+4]}})],1)]):t._e()})),0)]),e("div",{staticClass:"right"},[e("div",{staticStyle:{padding:"10px 0 20px 0","text-align":"center"}},[t._v(" "+t._s(t.ownname)+" "+t._s(t.ownuin)+" ")]),e("table",t._l(t.avatorList2,(function(a,i){return i%5==0?e("tr",{key:i},[e("td",[e("el-image",{staticStyle:{width:"150px",height:"200px"},attrs:{src:t.avatorList2[i]}})],1),e("td",[e("el-image",{staticStyle:{width:"150px",height:"200px"},attrs:{src:t.avatorList2[i+1]}})],1),e("td",[e("el-image",{staticStyle:{width:"150px",height:"200px"},attrs:{src:t.avatorList2[i+2]}})],1),e("td",[e("el-image",{staticStyle:{width:"150px",height:"200px"},attrs:{src:t.avatorList2[i+3]}})],1),e("td",[e("el-image",{staticStyle:{width:"150px",height:"200px"},attrs:{src:t.avatorList2[i+4]}})],1)]):t._e()})),0)])])},n=[],r=e("ed3b"),s=(e("e186"),e("d8ae"),e("bb00"),e("422f"),e("f34b"),e("9f71")),c={name:"avator",data:function(){return{avatorList1:[],avatorList2:[],mainuin:"",mainname:"",ownuin:"",ownname:""}},created:function(){this.getInfo()},methods:{getInfo:function(){var t=this;return Object(r["a"])(regeneratorRuntime.mark((function a(){var e,i,n,r;return regeneratorRuntime.wrap((function(a){while(1)switch(a.prev=a.next){case 0:return t.mainuin=t.$route.query.mainuin,t.mainname=t.$route.query.mainname,t.ownuin=t.$route.query.ownuin,t.ownname=t.$route.query.ownname,e={pid:1,uin:t.mainuin},i={pid:1,uin:t.ownuin},a.next=8,Object(s["a"])(e);case 8:return n=a.sent,a.next=11,Object(s["a"])(i);case 11:r=a.sent,Promise.all([n,r]).then((function(a){a.map((function(e){t.avatorList1=a[0].data.retData,t.avatorList2=a[1].data.retData}))}));case 13:case"end":return a.stop()}}),a)})))()}}},u=c,o=(e("9f5c"),e("cba8")),p=Object(o["a"])(u,i,n,!1,null,null,null);a["default"]=p.exports}}]);