// entry = 처리해야할 파일위치
// output = 처리 결과 - filename (처리하여 생성된 파일명) /  path (파일이 저장될 장소, 절대경로가 필요)
const path = require("path");

module.exports={
    entry:"./src/client/js/main.js",
    mode:"development",
    // production
    output:{
        filename:"main.js",
        path:path.resolve(__dirname,"assets","js"),
    },
    module:{
        rules:[
            {
                test:/\.js$/,
                use:{
                    loader:'babel-loader',
                    options: {
                        presets: [["@babel/preset-env", { targets: "defaults" }]],
                    },
                }
            }
            ,
            {
                test: /\.scss$/,
                // webpack는 역순으로 실행되기에 가장 먼저 실행되는 것이 use의 마지막에 들어가야함
                use: ["style-loader", "css-loader", "sass-loader"],
            }
        ]
    }
};