/**
 * 小程序配置文件
 */

// 此处主机域名修改成腾讯云解决方案分配的域名
var host = process.env.HOST;
var token = process.env.TOKEN;

var config = {

    // 下面的地址配合云端 Demo 工作
    service: {
        host,
        getjq: `${host}/site/3F7B07E2/cluster?token=${token}`,

        getzj: `${host}/site/3F7B07E2/hostResource/?limit=20&token=${token}`,

        getxj: `${host}/site/3F7B07E2/vmResource/?limit=100&token=${token}&offset=`
    }
};

module.exports = config;
