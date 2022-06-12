```js
pm2 start index.js    // 启动服务


pm2 list     // 打印出服务列表

--watch：监听应用目录的变化，一旦发生变化，自动重启。
-i or --instance：启用多少个实例，可用于负载均衡，如果 -i 0 或者 -i max，则根据当前机器核数确定实例数目。
--ignore-watch：排除监听的目录或文件，可以是特定的文件名，也可以是正则。
pm2 start app.js --watch -i max -n app1


pm2 restart app.js    // 重启


pm2 stop app_name | app_id    // 停止服务


pm2 stop all    // 停止全部应用


pm2 delete app_name | app_id    // 删除应用


pm2 delete all    // 删除全部


pm2 start app.js -i 3 // 开启三个进程


pm2 start app.js -i max // 根据机器CPU核数，开启对应数目的进程


pm2 logs    // 查看实时日志


pm2 monit    // 查看进程状态
```



配置文件

`pm2.json`

`package.json`中配置` "pm2": "pm2 start pm2.json"`

```json
{
    "apps": {
        "name": "express_project",       // 项目名          
        "script": "app.js",              // 执行文件
        "cwd": "./",                     // 根目录
        "args": "",                      // 传递给脚本的参数
        "interpreter": "",               // 指定的脚本解释器
        "interpreter_args": "",          // 传递给解释器的参数
        "watch": true,                   // 是否监听文件变动然后重启
        "ignore_watch": [                // 不用监听的文件
            "node_modules",
            "public"
        ],
        "exec_mode": "cluster_mode",     // 应用启动模式，支持 fork 和 cluster 模式
        "instances": "max",              // 应用启动实例个数，仅在 cluster 模式有效 默认为 fork
        "error_file": "./logs/app-err.log",         // 错误日志文件
        "out_file": "./logs/app-out.log",           // 正常日志文件
        "merge_logs": true,                         // 设置追加日志而不是新建日志
        "log_date_format": "YYYY-MM-DD HH:mm:ss",   // 指定日志文件的时间格式
        "min_uptime": "60s",                        // 应用运行少于时间被认为是异常启动
        "max_restarts": 30,                         // 最大异常重启次数
        "autorestart": true,                        // 默认为 true, 发生异常的情况下自动重启
        "restart_delay": "60"                       // 异常重启情况下，延时重启时间
        "env": {
           "NODE_ENV": "production",                // 环境参数，当前指定为生产环境
           "REMOTE_ADDR": ""               
        },
        "env_dev": {
            "NODE_ENV": "development",              // 环境参数，当前指定为开发环境
            "REMOTE_ADDR": ""
        },
        "env_test": {                               // 环境参数，当前指定为测试环境
            "NODE_ENV": "test",
            "REMOTE_ADDR": ""
        }
    }
}
复制代码
```




