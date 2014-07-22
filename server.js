/**
 * Created by wang on 2014/7/22.
 */
var httpserver = require("http");
var qs = require("querystring");
var url = require("url");
var fs = require("fs");

httpserver.createServer(onRequest).listen(8080);

function onRequest(request,response)
{
  var pathname = url.parse(request.url).pathname;
  if(pathname=="/")	//访问表单页面
  {
    response.writeHead(200,{"Content-Type":"text/html"});
    fs.readFile("index.html","utf-8",function(e,data){
      response.write(data);
      response.end();
    });
  }
  else if(pathname=="/postmail")	//处理post方式请求
  {
    var a="";
    request.addListener("data",function(postdata){
      a+=postdata;	//接收到的表单数据字符串，这里可以用两种方法将UTF-8编码转换为中文
      var b = qs.parse(a);		//转换成json对象
      var c = decodeURIComponent(a);		//对表单数据进行解码
      a = c;
      a = a + '\n' ;
      fs.appendFile('message.txt', a, function(err){
        if(err) throw err;
        console.log('It\'s saved!');
      });
    });
    request.addListener("end",function(){
      response.writeHead(200,{"Content-Type":"text/plain; charset=utf-8"});
      //response.write(a);
      response.write("谢谢你所提的意见");
      response.end();
    });
  }
  else if(pathname=="/getmail")	//处理get方式请求
  {
    var a = url.parse(request.url).query;
    var b = qs.parse(a);
    var c = decodeURIComponent(a);
    a = c;
    a = a + '\n' ;
    fs.appendFile('message.txt', a, function(err){
      if(err) throw err;
      console.log('It\'s saved!');
    });
    response.writeHead(200,{"Content-Type":"text/plain; charset=utf-8"});
    response.write("谢谢你所提的意见");
    response.end();
  }
  else
  {
    response.writeHead(200,{"Content-Type":"text/plain"});
    response.write("error");
    response.end();
  }
}

