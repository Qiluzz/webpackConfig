const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

//设置nodejs环境变量
process.env.NODE_ENV = 'production';
module.exports ={
    entry:'./js/index.js',
    output:{
        filename:'js/built.js',
        path:path.resolve(__dirname, 'build')
    },
    module:{
        rules:[
            {
                test:/\.css$/,
                use:[
                    // 'style-loader',
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    /**
                     * css 兼容性处理：postcss --> postcss-loader postcss-preset-env
                    "browserslist": {
                        "production": [
                            ">0.2%",
                            "not dead",
                            "not op_mini all"
                        ],
                        "development": [
                            "last 1 chrome version",
                            "last 1 firefox version",
                            "last 1 safari version"
                        ]
                    }
                     */
                    {
                        loader:'postcss-loader',
                        options:{
                            postcssOptions: {
                                ident: 'postcss',
                                  //打包后有兼容性样式代码
                                plugins:[
                                    require('postcss-preset-env')
                                ],
                                //这样写就没有兼容性代码
                                // plugins:() => [
                                //     // postcss的插件
                                //     require('postcss-preset-env')()
                                // ]
                            }
                        }
                        
                    }
                ]
            },
            {
                test:'/\.less$/',
                use:['style-loader','css-loader','less-loader']
            },
            {
                test:/\.html/,
                loader:'html-loader',
                 options: {
                   esModule: false,
                 }
            },{
                test:/\.(jpg|png|gif)$/,
                loader:'url-loader',
                options:{
                    limit:8*1024,
                    name:'[hash:8].[ext]',
                    esModule:false,
                }
            }
        ]
    },
    plugins:[
        new HtmlWebpackPlugin({
            template:'./index.html'
        }),
        new MiniCssExtractPlugin({
            filename:'css/built.css'
        })
    ],
    mode:'production'
}