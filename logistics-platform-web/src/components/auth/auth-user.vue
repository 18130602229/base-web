<template>
  <div class="myTable">
    <div class="searchNav" >
      <el-button class="newAdd" type="primary" @click="dialogVisible = true">新增</el-button>
      <span><span>账号 ：</span><el-input v-model="searchInfo.account" clearable placeholder="请输入"></el-input></span>
      <span><span>角色：</span>
                <el-select v-model="searchInfo.role" clearable placeholder="请选择">
                    <el-option
                            v-for="(item, i) in roleList"
                            :key="i"
                            :label="item.description"
                            :value="item.id">
                    </el-option>
                </el-select>
            </span>
      <el-button type="primary" @click="search" style="float: right; position: relative;left: -20px;" >搜索</el-button>
    </div>
    <div class="tableStyle">
      <el-table v-loading="loading" :data="tableData" style="width: 100%;" :row-class-name="tableRowClassName">
        <el-table-column prop="account" label="账号" ></el-table-column>
        <el-table-column prop="roleList[0].description" label="角色"></el-table-column>
        <el-table-column prop="createTime" label="创建时间"></el-table-column>
        <el-table-column prop="updateTime" label="修改时间"></el-table-column>
        <el-table-column prop="enabled" label="状态">
          <template slot-scope="scope">
            {{ scope.row.enabled | showState }}
          </template>
        </el-table-column>
        <el-table-column
                fixed="right"
                label="操作"
                width="250">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="edit(scope.row)">编辑</el-button>
            <el-button type="text" size="small" @click="confirmChangeState(scope.row)">{{scope.row.enabled |consumerState }}</el-button>
            <el-button type="text" size="small" @click="resetPassword(scope.row.id)">重置密码</el-button>
            <el-button type="text" size="small" @click="confirmRemove(scope.row.id)">删除</el-button>
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
    <div>
      <el-dialog
              :title="dialogTitle"
              :visible.sync="dialogVisible"
              width="30%"
              :before-close="handleClose">
        <div class="addInfoStyle">
          <div>
            <span>所属公司：</span>
            <el-select v-model="addInfo.companyId" clearable placeholder="请选择">
              <el-option  v-for="(item, key) in companyList" :key="key" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </div>
          <div><span>账号：</span><el-input v-model="addInfo.account" placeholder="请输入" clearable></el-input></div>
          <div><span>角色：</span><el-select v-model="addInfo.roleId" clearable placeholder="请选择">
            <el-option
                    v-for="(item, i) in roleList"
                    :key="i"
                    :label="item.description"
                    :value="item.id">
            </el-option>
          </el-select></div>
          <div><span>默认新增密码：</span><span>12345678</span> </div>
        </div>
        <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="save">确 定</el-button>
              </span>
      </el-dialog>
    </div>
  </div>

</template>

<script>
    import {axios} from "../../config/axios";
    export default {
        name: "white-list",
        data () {
            return {
                dialogTitle:'新增用户',
                total:1,
                tableData: [],
                loading: false,
                dialogVisible: false,
                currentPage:1,
                roleList:'',
                addInfo:{
                    account:'',
                    roleId:'',
                    companyId:'',
                },
                searchInfo:{
                    account:'',
                    role:'',
                    pageNumber:1,
                    pageSize:10,
                },
                companyList:[],
            }
        },
        created: function () {
            this.pageInfo();
            this.getRoleList();
            this.getCompany();
        },
        methods:{
            search(){
                this.pageInfo();
            },
            tableRowClassName({row, rowIndex}) {
                if (rowIndex%2 ===0) {
                    return 'success-row';
                }
                return '';
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.searchInfo.pageNumber = val ;
                this.pageInfo();
            },
            validate(){
                console.log("validate:",this.addInfo)
                let flag = true;
                let msg  = "";
                if (this.addInfo.account.trim().length < 3){
                    flag = false;
                    msg = " 账号长度至少 3 位 "
                }else if(this.addInfo.role === ""){
                    flag = false;
                    msg = " 角色不能为空 "
                }
                return {code:flag,msg:msg}
            },
            save(){
                let validateObj = this.validate();
                if(typeof(this.addInfo.id)=== "undefined"){  // 保存
                    if (validateObj.code){
                        axios.post('/user',this.addInfo).then(result => {
                            this.dialogVisible = false;
                            if (result.code !== 200){
                                console.log(result);
                            }
                            this.clearObj(this.addInfo); // 清空新增数据
                            this.pageInfo();
                        }).catch(err => {
                            console.log(err);
                        });
                    }else{
                        this.msg(validateObj.msg);
                    }
                }else{  // 编辑
                    if (validateObj.code){
                        // 当前系列 是开启的
                        axios.put('/user/info',this.addInfo).then(result => {
                            this.dialogVisible = false;
                            if (result.code !== 200){
                                console.log(result);
                            }
                            this.pageInfo();
                            this.addInfo.id = undefined;
                            this.clearObj(this.addInfo); // 清空新增数据
                            this.dialogTitle="新增用户";
                        }).catch(err => {
                            console.log(err);
                        });
                    }else{
                        this.msg(validateObj.msg);
                    }
                }
            },
            remove(id){
                axios.delete('/user',{data: {id:id}}).then(result => {
                    if (result.code !== 200){
                        console.log(result);
                    }
                    this.pageInfo();
                })
            },
            confirmRemove(id){
                this.$confirm('此操作将删除该数据, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.remove(id);
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            handleClose(done) {
                this.clearObj(this.addInfo); // 清空新增数据
                done();
            },
            edit(obj){
                this.dialogTitle = "用户编辑";
                this.addInfo.id = obj.id;
                this.addInfo.account = obj.account;
                this.addInfo.roleId = obj.roleList[0].id;
                this.dialogVisible = true;
            },
            confirmChangeState(obj){
                let operation = obj.enabled?"禁用":"开启";
                this.$confirm('确定要'+operation+obj.account+', 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.changeState(obj.id);
                    this.$message({
                        type: 'success',
                        message: operation+'成功!'
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'+operation
                    });
                });
            },
            changeState(id){
                axios.put("/user/disable",{id:id}).then(res => {
                    if (res.code !== 200){
                        console.log(res);
                    }
                    this.pageInfo();
                }).catch(err =>{
                    console.log(err);
                })
            },
            resetPassword(id){
                axios.put("/user/reset",{id:id}).then(res => {
                    if (res.code !== 200){
                        console.log(res);
                    }
                    this.pageInfo();
                }).catch(err =>{
                    console.log(err);
                })
            },
            pageInfo(){
                if (this.loading)  return; // 防止重复提交
                this.loading=true;
                axios.get('/user',{
                    params: this.searchInfo
                }).then(result => {
                    this.loading=false;
                    if (result.code !== 200){
                        console.log(result);
                    }
                    let page = result.data;
                    console.log("page:",page);
                    this.total = page.totalRow;
                    this.tableData = page.list;
                }).catch(err => {
                    console.log(err);
                    this.loading=false;
                });
            },
            getRoleList(){
                axios.get('/role-all',{
                    params: this.searchInfo
                }).then(result => {
                    this.loading=false;
                    if (result.code !== 200){
                        console.log(result);
                    }
                    console.log("result:",result);
                    this.roleList = result.data;

                })
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
        },filters: {
            showState(val){
                if (val){
                    return "可用";
                }
                return "禁用"
            },
            consumerState(val){
                if (val){
                    return "禁用";
                }
                return "开启"
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
