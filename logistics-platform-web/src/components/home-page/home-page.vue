<template>
    <div>
        <div class="little-head">人脸查询(1:n)</div>
        <div class="pang-left">
            <div>
                <span>所属公司：</span>
                <el-select v-model="checkCompanyId" clearable placeholder="请选择">
                    <el-option  v-for="(item, key) in companyList" :key="key" :label="item.name" :value="item.id"></el-option>
                </el-select>
            </div>
            <div>
                <el-upload
                        class="upload-demo"
                        :action="uploadFile"
                        :limit="1"
                        :on-success="onSuccess"
                        :file-list="fileList"
                        list-type="picture">
                    <el-button size="small" type="primary">点击上传</el-button>
                    <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                </el-upload>
                <el-button type="primary" @click="submitData" style="width: 276px;">提交</el-button>
            </div>
        </div>
        <div class="page-bottom">
            <div class="search-result">查询结果：</div>
            <div class="show-data" v-if="showData == '暂无数据'" >{{showData}}</div>
            <div class="show-data1" v-else>{{showData}}</div>
        </div>
    </div>
</template>

<script>
    import {axios} from "../../config/axios";
    export default {
        name: "home-page",
        data () {
            return {
                companyList:[],
                showData:'暂无数据',
                fileList:[],
                searchFace:{
                    dbName:'',
                    limit:1,
                    imageUrl:'',
                },
                checkCompanyId:'',
                companyId:'',
            }
        },
        watch: {

        },
        computed:{
            uploadFile:function () {
                return this.baseURL+"person/search-face"
            }
        },
        created: function () {
            this.getCompany();
        },
        methods:{
            onSuccess(res){
                if (res.code != 200){
                    console.error(res);
                    return
                }
                this.searchFace.imageUrl = res.data;
            },
            getCompany(){
                axios.get('face-compare/all',{
                }).then(result => {
                    this.companyList = result.data;
                    console.info("company:{}",result);
                }).catch(err => {
                    console.log(err);
                });
            },
            submitData(){
                axios.get('face-compare/searchFace',{params:this.searchFace})
                    .then(res => {
                    console.info("face-compare/searchFace:",res);
                    if (res.code != 200){
                        console.error("face-compare/searchFace",res);
                    }
                    this.showData = res.data;
                }).catch(err => {
                    console.log(err);
                });
            }
        }
    }
</script>
<style lang="less" scoped>
    .little-head{
        color: #535c64;
        font-size: 21px;
        border-bottom: 1px solid #ccc;
        padding-bottom: 10px;
    }
    .pang-left{
        line-height: 4;
        border-bottom: 1px solid #ccc;
        margin: 20px;
    }
    .search-result{
        color: #535c64;
        font-size: 18px;
    }
    .page-bottom{
        margin: 20px;
    }
    .show-data{
        margin: 10px 0 0 100px;
        color: #ccc;
    }
    .show-data1{
        margin: 10px 0 0 100px;
    }
</style>
