// entry = 처리해야할 파일위치
// output = 처리 결과 - filename (처리하여 생성된 파일명) /  path (파일이 저장될 장소, 절대경로가 필요)
const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const BASE_JS = "./src/client/js/";
module.exports={
    plugins: [new MiniCssExtractPlugin({
        filename:"css/style.css",
    })],
    // 서버 구동시 변경할 예정
    watch:true,
    entry:{
        main:BASE_JS+"main.js",
        videoPlayer : BASE_JS+"videoPlayer.js",
        recorder : BASE_JS+"recorder.js",
        commentSection:BASE_JS+"commentSection.js",
    },
    mode:"development",
    // production
    output:{
        filename:"js/[name].js",
        path:path.resolve(__dirname,"assets"),
        // 이전폴더 삭제
        clean:true,
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
                use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
            }
        ]
    }
};