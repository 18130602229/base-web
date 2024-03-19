<template>
    <div class="myTable">
        <div class="searchNav">
            <span><span>账号 ：</span><el-input v-model="searchInfo.account" clearable placeholder="请输入"></el-input></span>
            <span>
                <span>登录时间 ：</span>
                <el-date-picker
                    v-model="searchInfo.date"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="选择日期">
                </el-date-picker>
            </span>
            <el-button type="primary" @click="search" style="float: right; position: relative;left: -20px;" >搜索</el-button>
        </div>
        <div class="tableStyle">
            <el-table v-loading="loading" :data="tableData" style="width: 100%;" :row-class-name="tableRowClassName">
                <el-table-column label="账号" >
                    <template slot-scope="scope">
                        {{ scope.row.userId | showAccount }}
                    </template>
                </el-table-column>
                <el-table-column prop="ip" label="登录 IP"></el-table-column>
                <el-table-column prop="createTime" label="登录时间"></el-table-column>
                <el-table-column label="操作状态" >
                    <template slot-scope="scope">
                        {{ scope.row.logType | showLogType }}
                    </template>
                </el-table-column>
                <el-table-column prop="enabled" label="是否成功">
                    <template slot-scope="scope">
                        {{ scope.row.succeed | showState }}
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                    @current-change="handleCurrentChange"
                    :current-page.sync="currentPage"
                    :page-size="searchInfo.pageSize"
                    background
                    layout="total, prev, pager, next"
                    :total="total">
            </el-pagination>
        </div>
    </div>
</template>

<script>
    import {axios} from "../../config/axios";
    let userMap = new Map();
    export default {
        data () {
            return {
                loginDate:'',
                total:1,
                tableData: [],
                currentPage:1,
                loading:false,
                searchInfo:{
                    date:'',
                    account:'',
                    pageNumber:1,
                    pageSize:10,
                }
            }
        },
        created: function () {
            let role = localStorage.getItem("blackview-user");
            if (JSON.parse(role).role === "admin") {
                this.getUserList();
            }else{
                this.searchInfo.account=-1;
            }
            this.pageInfo();
        },
        methods: {
            pageInfo() {
                axios.get('/accountLog', {
                    params: this.searchInfo
                }).then(result => {
                    this.loading = false;
                    if (result.code !== 200) {
                        console.log(result);
                    }
                    let page = result.data;
                    this.total = page.total;
                    this.tableData = page.list;
                }).catch(err => {
                    console.log(err);
                    this.loading = false;
                });
            },
            search(){
                this.pageInfo();
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.searchInfo.pageNumber = val;
                this.pageInfo();
            },
            tableRowClassName({row, rowIndex}) {
                if (rowIndex%2 ===0) {
                    return 'success-row';
                }
                return '';
            },
            getUserList(){
                axios.get('/user/all',{
                    params: this.searchInfo
                }).then(result => {
                    this.loading=false;
                    if (result.code !== 200){
                        console.log(result);
                    }
                    result.data.forEach(item =>{
                        userMap.set(item.id,item.account);
                    });
                })
            }
        },
        filters: {
            showState(v){
                if (v){
                    return "成功";
                } else{
                    return "失败";
                }
            },
            showLogType(val){   //1:login,2:logout,3:register
                switch(val){
                    case 1 :
                        return "登录";
                        break; //可选
                    case 2 :
                        return "退出";
                        break; //可选
                    //你可以有任意数量的case语句
                    default : //可选
                        return "注册";
                }
            },
            showAccount(val){
                let result = userMap.get(val);
                if(typeof (result) !== "undefined"){
                    return result ;
                }
                return val;
            }
        }
    }
</script>
<style lang="less" scoped>
    .addInfoStyle div{
        line-height: 4;
        .el-input{
            margin-right: 15px;
            width: 200px;
        }
    }
</style>
