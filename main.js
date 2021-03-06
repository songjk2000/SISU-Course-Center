var length = 0;
var fcfileid = 0;
var fcid = 0;
var got = false;

function Toast(msg,duration){
    var m = document.createElement('div');
    var democlass=document.createAttribute("class");
    democlass.value="democlass";
    m.setAttributeNode(democlass);
    m.innerHTML = msg;
    m.style.cssText="width:100%;height:100%;color: white;text-align: center;position: fixed;padding-top:20%;top: 0%;left: 0%;z-index: 999999;background-color: black;font-size: 30px;font-weight:bold;";
    document.body.appendChild(m);
    setTimeout(function() {
      var d = 0.5;
      setTimeout(function() { document.body.removeChild(m);}, d * 1000);
    }, duration)
};


function formattime(time){
    hour = Number(time.substring(0,2));
    minute = Number(time.substring(3,5));
    second = Number(time.substring(6,8));
    return hour*3600 + minute*60 + second
};

function sleep(i) {
    return new Promise(function (resolve, reject) {
    setTimeout(function (){resolve()},i);})
};


function getinfo(i) {
    return new Promise(function (resolve, reject) {
    try{
        fcfileid = angular.element(document.getElementById("div_play")).scope().filedata.FCFileID;
        fcid = angular.element(document.getElementById("div_play")).scope().filedata.FCID;
        jwplayer("div_play").play();
        length = formattime(document.querySelectorAll("td[ng-bind*=\"fcFile.LearnLength|formatSeconds\"]")[i].innerText)
    }
    catch(err){};
    if (length > 0){
        var s = new XMLHttpRequest();
        s.open("POST", "/G2S/DataProvider/OC/FC2/FCProvider.aspx/FCFileLog_LearnLength_Up", true);
        s.setRequestHeader("Content-type", "application/json");
        s.send(JSON.stringify({"fcId":fcid,"fcFileId":fcfileid,"learnLength":length}));
        document.getElementsByClassName("ngdialog-close")[0].click();
        Toast('第'+(i+1)+'个进度修改完成',2000);
        got = true;
    };
    setTimeout(function (){resolve()},500)
    })
};

async function get(i){
    Toast('开始修改第'+(i+1)+'个进度',2000);
    document.querySelectorAll("a.name.ng-binding")[i].click();
    while (true){
        await getinfo(i);
        await sleep(500);
        if (got){break;};
    }
};


async function task(i){
    length = 0;
    fcfileid = 0;
    fcid = 0;
    got = false;
    await get(i);
    await sleep(200);
    console.log(length,fcfileid,fcid)
};

async function getall() {
    num = document.querySelectorAll("a.name.ng-binding").length;
    getstr = "";
    for (i=0;i<num;i++){
        getstr = getstr + "await task(" + i +");"
    } ;
    await eval("f = async function() {" + getstr + "};f()");
    Toast('全部进度修改完成',3000)
};

getall()
