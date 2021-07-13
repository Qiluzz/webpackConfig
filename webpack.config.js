const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
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
            /**
             * 1.js兼容性处理： babel-loader @babel-loader/preset-env  @babel/core
             * 2.全部的js兼容性处理 --> @babel/polyfill
             * 问题：我只要解决部分兼容性问题，但是所有的兼容性代码全部引入，体积太大
             * 3.需要做兼容性处理的就做：按需加载 -> corejs
             */
            {
                test:/\.js$/,
                loader:'babel-loader',
                exclude: /node_modules/,
                options:{
                    //预设：指示babel做怎么样的兼容
                    presets:[
                        ['@babel/preset-env',
                        {
                            modules: false,
                           // 按需加载
                            useBuiltIns: 'usage',
                             // 指定core-js版本
                            corejs: {
                               version: 3
                            },
                             // 指定兼容性做到哪个版本浏览器
                            targets: {
                               chrome: '60',
                               firefox: '60',
                               ie: '9',
                               safari: '10',
                               edge: '17'
                            }
                        }]
                    ]
                }
            },
            /**
             * 语法检查：eslint-loader eslint
             * 注意：只检查自己写的源代码，第三方库不用检查
             * 设置检测规则：
             *      package.json中elintConfig中设置
                    "eslintConfig": {
                        "extend": "airbnb-base"
                    }
             *      airbnb --> eslint-config-airbnb-base eslint-plugin-import
             */
            {
                test:/\.js$/,
                loader:'eslint-loader',
                exclude:'/node_modules',
                options:{
                    //自动修复
                    fix:true
                }
            },
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
                                    // postcss的插件
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
            template:'./index.html',
            minify:{
                //移除空格
                collapseWhitespace:true,
                //移除注释
                removeComments:true
            }
        }),
        new MiniCssExtractPlugin({
            filename:'css/built.css'
        }),
        //压缩css
        new OptimizeCssAssetsWebpackPlugin()
    ],
    //生产环境自动压缩
    mode:'production'
}