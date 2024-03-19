<template>
    <div class="myTable">
        <div class="searchNav">
            <el-button class="newAdd" type="primary" @click="showAddPermissionPage">新增</el-button>
            <span><span>角色 ：</span><el-select v-model="searchInfo.role" clearable placeholder="请选择角色">
                    <el-option
                            v-for="(item, i) in roleList"
                            :key="i"
                            :label="item.description"
                            :value="item.role">
                    </el-option>
                </el-select></span>
            <el-button type="primary" @click="search" style="float: right; position: relative;left: -20px;" >搜索</el-button>
        </div>
        <div class="tableStyle">
            <el-table v-loading="loading" :data="tableData" style="width: 100%;" :row-class-name="tableRowClassName">
                <el-table-column prop="role" label="角色" ></el-table-column>
                <el-table-column prop="description" label="描述" ></el-table-column>
                <el-table-column prop="createTime" label="创建时间"></el-table-column>
                <el-table-column prop="updateTime" label="修改时间"></el-table-column>
                <el-table-column
                        fixed="right"
                        label="操作"
                        width="250">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="editRole(scope.row)">编辑</el-button>
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
                    width="45%"
                    :before-close="handleClose">
                <div class="addInfoStyle">
                    <div><span>角色：</span><el-input v-model="addInfo.role" placeholder="请输入" clearable></el-input>
                        <span>描述：</span><el-input  v-model="addInfo.description" placeholder="请输入" clearable></el-input>
                    </div>
                    <div><span>权限：</span>
                        <div style="margin:0px 20px;">
                            <div style=" float: left;    border: 1px solid #ccc;padding: 10px;    width: 230px;">
                                <div>未有权限</div>
                                <el-tree style="height: 330px;overflow-y: auto;"
                                        :data="unOwnPermissions"
                                        default-expand-all
                                        show-checkbox
                                        node-key="id"
                                        ref="unOwnTree"
                                        highlight-current
                                        :default-checked-keys="defaultCheckedKeys"
                                        :props="defaultProps">
                                </el-tree>
                            </div>
                            <div style=" float: left;">
                                <button @click="removeRight"><i class="el-icon-d-arrow-right"></i></button>
                                <br>
                                <button @click="removeLeft"><i class="el-icon-d-arrow-left"></i></button>
                            </div>
                            <div style=" float: right; border: 1px solid #ccc;padding: 10px;    width: 230px;">
                                <div>已有权限</div>
                                <el-tree style="height: 330px;overflow-y: auto;"
                                        :data="ownPermissions"
                                        default-expand-all
                                        show-checkbox
                                        node-key="id"
                                        ref="ownTree"
                                        highlight-current
                                        :props="defaultProps">
                                </el-tree>
                            </div>
                        </div>
                    </div>
                </div>
                <div style="clear: both"></div>
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
    let currentTree; // 临时保存要移向的树
    export default {
        name: "white-list",
        data () {
            return {
                unOwnPermissions: [], // 未拥有的树权限数据
                ownPermissions:[],    // 已拥有的树权限数据
                havePermissions:[],
                defaultCheckedKeys:[],
                dialogTitle:'',
                interval:0, // 定时任务解决 将左侧选择的移到右侧 时可以出现 为空的情况
                defaultProps: {
                    children: 'children',
                    label: 'label'
                },
                total:1,
                tableData: [],
                loading: false,
                dialogVisible: false,
                currentPage:1,
                roleList:'', // 得到角色
                addInfo:{
                    role:'',
                    description:'',
                    addPermissions:[],
                    removePermissions:[]
                },
                searchInfo:{
                    role:'',
                    pageNumber:1,
                    pageSize:10,
                }
            }
        },
        created: function () {
            this.getAllRole(); // 搜索框中使用
            this.pageInfo();
        },
        methods:{
            removeRight(){
                let $unOwnTree = this.$refs.unOwnTree;
                let checkedNodes = $unOwnTree.getCheckedKeys();
                console.log("removeRight:",checkedNodes);
                checkedNodes.forEach(item =>{
                    let node = $unOwnTree.getNode(item);
                    let nodeData = $unOwnTree.getCheckedNodes(item);
                    if (node !== null){
                        currentTree = this.$refs.ownTree;
                        this.appendNode(node);
                        $unOwnTree.remove(node,nodeData);
                    }
                });

                clearInterval(this.interval); // 当移过来的不为空是，停止定时任务。
            },
            removeLeft(){
                let $ownTree = this.$refs.ownTree;
                let checkedNodes = $ownTree.getCheckedKeys();
                console.log("removeLeft:",checkedNodes);
                checkedNodes.forEach(item =>{
                    let node = $ownTree.getNode(item);
                    let nodeData = $ownTree.getCheckedNodes(item);
                    if (node !== null){
                        currentTree = this.$refs.unOwnTree;
                        this.appendNode(node);
                        // 移除左边的
                        $ownTree.remove(node,nodeData);
                    }
                })
            },
            // 这个编写过程是先从左边 向右边添加，当各种情况都满足时。再加上反向操作。
            appendNode(node){
                // 1、如果移动的是一级目录
                //   ①先判断 当前目录 在右边一个目录的位置
                // 先判断是否为一级目录
                if (node.level === 1){ // level = 1 说明是一级目录
                    // 获取节点的 id
                    const oneMenuNodeData = node.data;
                    this.oneMenuHandle(oneMenuNodeData);
                    /*
                * 2、如果移动的是二级目
                *   ① 当右边没有一级目录时
                *       一、先要获取一级目录数据
                *       二、查看应该插入右边目录位置
                *   ② 当右边有一级目录
                *       一、先要获取二级目录的位置
                */
                }else if(node.level ===2){
                    const oneMenu = JSON.parse(JSON.stringify(node.parent.data)); // 深度拷贝 才不会影响到 左侧的树结构
                    oneMenu.children = [node.data];
                    this.oneMenuHandle(oneMenu);
                    /*
                    * 3、如果移动的是权限
                    *   ① 当右边没有一级目录时
                    *       一、当没有二级目录时
                    *           1、创建，二级目录，一个目录，直接迁移
                    *       二、当有二级目录时
                    *           判断权限插入的位置
                    *   ② 当右边有一级目录
                    *       一、有二级目录。
                    *               判断权限插入位置
                    *       二、没有二级目录
                    *               把二级目录一起迁移过去
                    **/
                }else { // 移动的是权限
                    const ownTowMenuId = node.parent.data.id;
                    let towMenuNode = currentTree.getNode(ownTowMenuId);
                    if (towMenuNode === null){ //当没有二级菜单
                        const ownOneMenuId = node.parent.parent.data.id;
                        let oneMenuNode = currentTree.getNode(ownOneMenuId);

                        let removeTowMenuData = JSON.parse(JSON.stringify(node.parent.data));
                        // 将权限放到二级菜单中
                        removeTowMenuData.children = [node.data];
                        if (oneMenuNode === null){ // 当没有一级菜单
                            let removeOneMenuData = JSON.parse(JSON.stringify(node.parent.parent.data));
                            removeOneMenuData.children = [removeTowMenuData];
                            this.oneMenuHandle(removeOneMenuData);
                        } else{ // 当有一级菜单
                            this.oneMenuHandle(removeTowMenuData);
                        }
                    } else { //当有二级菜单
                        this.towMenuHandle(node.data,towMenuNode);
                    }
                }
            },
            // 当有二级目的时候
            towMenuHandle(permission, towMenuNode){
                // 获取二级目录下面所有权限
                let ownPermissions = towMenuNode.data.children;
                let ownPermissionsArr = [];
                ownPermissions.forEach(permission =>{
                    ownPermissionsArr.push(permission.id);
                });
                this.toInsert(ownPermissionsArr,permission);
            },
            oneMenuHandle(oneMenuNodeData){
                let ownOneMenu = currentTree.getNode(oneMenuNodeData.id);
                if (ownOneMenu === null) { // 说明右边未拥有
                    // 获取右边所有的一级目。
                    const ownTreeDataArr = currentTree.data;
                    let ownOneMenus = [];
                    ownTreeDataArr.forEach(oneMenu =>{
                        ownOneMenus.push(oneMenu.id);
                    })
                    // 获取当前一级目录附近的一级目录的 id 和 插入当前id 之前还是之后。
                    if (ownOneMenus.length >0){
                        this.toInsert(ownOneMenus,oneMenuNodeData);
                    }else {
                        currentTree.append(oneMenuNodeData,0);
                    }
                }else{ // 右边拥有一级目录时
                    // 需要右移的二级目录 遍历进行插入
                    let rightMoveTowMenu = oneMenuNodeData.children;
                    rightMoveTowMenu.forEach(towMenu =>{
                        let ownTowMenu = currentTree.getNode(towMenu.id); // 获取右边拥有的二级目录
                        if(ownTowMenu === null){ // 如果不存在
                            let ownTowTreeDataArr = ownOneMenu.data.children;
                            let ownTowMenus = [];
                            ownTowTreeDataArr.forEach(oneMenu =>{
                                ownTowMenus.push(oneMenu.id);
                            })
                            this.toInsert(ownTowMenus,towMenu);
                        }else{ // 如果存在
                            let ownPermissions = [];
                            // 获取原来的 二级目录下的所有的权限
                            ownTowMenu.data.children.forEach(ownPermission =>{
                                ownPermissions.push(ownPermission.id);
                            });
                            // 得到 要移动的二级目录下的所有权限
                            towMenu.children.forEach(unOwnPermission =>{
                                this.toInsert(ownPermissions,unOwnPermission);
                            })
                        }
                    });
                }
            },
            // 获取当前一级目录附近的一级目录的 id 和 插入当前id 之前还是之后。
            getNearbyOneMenu(ownOneMenus,oneMenuId){
                let nearbyId = -1;
                let isBefore = false;
                ownOneMenus.some(id =>{
                    if (oneMenuId<id){
                        nearbyId = id;
                        isBefore = true;
                        return true;
                    }
                });
                // 如果 nearbyId !== -1 则将 ownOneMenus 数组中最大的赋值给 nearbyId
                nearbyId = nearbyId !== -1?nearbyId:ownOneMenus[ownOneMenus.length-1];
                return {nearbyId:nearbyId,isBefore:isBefore};
            },
            toInsert(arr,toMoveNode){
                const nearbyOnePermission = this.getNearbyOneMenu(arr.sort(),toMoveNode.id);
                if (nearbyOnePermission.isBefore) {
                    currentTree.insertBefore(toMoveNode,nearbyOnePermission.nearbyId);
                }else{
                    currentTree.insertAfter(toMoveNode,nearbyOnePermission.nearbyId);
                }
            },
            search(){
                this.pageInfo();
            },
            showAddPermissionPage(){
                this.dialogTitle = "新增角色";
                this.dialogVisible = true;
                this.ownPermissions = Object.values([]); // 清空右侧的权限
                this.getPermission();  // 获取左侧的权限
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
                let flag = true;
                let msg  = "";
                if (this.addInfo.role.length < 3){
                    flag = false;
                    msg = " 角色 长度有误 "
                }else if(this.addInfo.description.length < 3){
                    flag = false;
                    msg = "角色描述 长度有误 "
                }
                return {code:flag,msg:msg}
            },
            save(){
                let validateObj = this.validate();
                if (validateObj.code){
                    if (typeof (this.addInfo.id) === "undefined"){ // 新增
                        this.getPermissionsId(this.$refs.ownTree.data); // 递归得到所有节点的 id
                        console.log("permissions:",this.addInfo.addPermissions);
                        axios.post('/role',this.addInfo).then(result => {
                            this.dialogVisible = false;
                            if (result.code !== 200){
                                console.log(result);
                            }
                            this.pageInfo();
                            this.clearObj(this.addInfo); // 清空新增数据
                        }).catch(err => {
                            console.log(err);
                        });
                    } else { // 编辑
                        console.log("this.$refs.ownTree.data:",this.$refs.ownTree.data);
                        this.getPermissionsId(this.$refs.ownTree.data); // 递归得到所有节点的 id
                        let diffInfo = this.diff(this.havePermissions,this.addInfo.addPermissions); // 比较两个数组差异
                        this.addInfo.addPermissions = diffInfo[0];
                        this.addInfo.removePermissions = diffInfo[1];
                        console.log("diffInfo:",diffInfo);
                        axios.put('/role',this.addInfo).then(result => {
                            this.dialogVisible = false;
                            if (result.code !== 200){
                                console.log(result);
                            }
                            this.pageInfo();
                            this.clearObj(this.addInfo); // 清空新增数据
                        }).catch(err => {
                            console.log(err);
                        });
                    }
                }else{
                    this.msg(validateObj.msg);
                }


            },
            editRole(obj){
                this.dialogTitle = "编辑角色";
                this.ownPermissions = Object.values([]); // 清空右侧的权限
                const newObj = JSON.parse(JSON.stringify(obj));
                console.log("roleId:",obj);
                this.addInfo = {id:newObj.id, role:newObj.role, description:newObj.description, addPermissions:[], removePermissions:[]};

                this.dialogVisible = true; // 展现页面
                this.getOwnPermissions(obj.id);  // 所有右侧目录和权限
                this.getPermission();
                this.interval = setInterval(() => {
                    console.log("interval:=======================");
                    this.removeRight();
                }, 1000)
            },
            getPermissionsId(data){
                console.log("this.addInfo",this.addInfo);
                data.forEach( item =>{
                    this.addInfo.addPermissions.push(item.id);
                    if( item.children.length > 0 ){
                        this.getPermissionsId(item.children);
                    }
                })
            },
            remove(id){
                axios.delete('/role',{data: {id:id}}).then(result => {
                    if (result.code !== 200){
                        console.log(result);
                    }
                    this.pageInfo();
                })
            },
            confirmRemove(obj){
                this.$confirm('此操作将删除该数据, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.remove(obj);
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
            diff(arr1, arr2) {     // 比较两个数组的差异
                var result = [];
                var addArr = [];
                var lessenArr = [];
                var arr3=arr1.concat(arr2);//将arr1和arr2合并为arr3
                for(var i = 0; i<arr3.length; i++){
                    if(arr1.indexOf(arr3[i])<0){
                        addArr.push(arr3[i]);
                    }
                    if(arr2.indexOf(arr3[i])<0){
                        lessenArr.push(arr3[i]);
                    }
                }
                result.push(addArr);
                result.push(lessenArr);
                return result;
            },
            handleClose(done) {  // 弹出框点击右上角的 X 隐藏弹出框
                this.clearObj(this.addInfo); // 清空新增数据
                done();
            },
            getAllRole(){
                axios.get('/role-all',).then(result => {
                    this.loading=false;
                    if (result.code !== 200){
                        console.log(result);
                    }
                    this.roleList = result.data;
                }).catch(err => {
                    console.log(err);
                    this.loading=false;
                });

            },
            pageInfo(){
                if (this.loading)  return; // 防止重复提交
                this.loading=true;
                axios.get('/role',{
                    params: this.searchInfo
                }).then(result => {
                    this.loading=false;
                    if (result.code !== 200){
                        console.log(result);
                    }
                    let page = result.data;
                    this.total = page.total;
                    this.tableData = page.list;
                }).catch(err => {
                    console.log(err);
                    this.loading=false;
                });
            },
            getPermission(){
                axios.get('/permission').then(result => {
                    if (result.code !== 200){
                        console.log(result);
                    }
                    this.unOwnPermissions =  this.toTree(result.data);
                });
            },
            getOwnPermissions(roleId){
                this.havePermissions = [];
                this.defaultCheckedKeys = [];
                axios.get('/permissionByRoleId',{params:{roleId:roleId}}).then(result => {
                    if (result.code !== 200){
                        console.log(result);
                    }
                    // 保存 角色现有的所有的权限
                    result.data.forEach(item =>{
                        let permissionId = item.id;
                        this.havePermissions.push(permissionId);
                        if (item.type === 0){
                            this.defaultCheckedKeys.push(permissionId);
                        }
                    });
                });
            },
            toTree(data){
                let firstMenuMap = new Map(); // 以第一目录id 为 key，下标作为 value
                let secondMenuMap = new Map();
                let permissionMap = new Map();
                let iMap = new Map();
                let j = 0;
                const parent = {} ;
                data.forEach(item =>{
                    if(item.type === 0 && item.parentId ===0){ // 这个是一级菜单
                        parent[j] = {
                            label: item.permission,
                            value: item.id,
                            id: item.id,
                            children: [],
                        };
                        firstMenuMap.set(item.id,j);
                        j++;
                    }else {
                        if(item.type === 0){  // 这个是二级菜单
                            permissionMap.set(item.id, item.parentId);
                            let parentIdIndex = secondMenuMap.get(item.parentId);
                            if(typeof(parentIdIndex) === "undefined"){
                                parentIdIndex = 0;
                                secondMenuMap.set(item.parentId, parentIdIndex);
                            }else{
                                parentIdIndex = parentIdIndex+1;
                                secondMenuMap.set(item.parentId, parentIdIndex);
                            }
                            iMap.set(item.id, parentIdIndex);
                            const oneIndex = firstMenuMap.get(item.parentId);
                            parent[oneIndex].children.push({
                                label: item.description,
                                value: item.id,
                                id: item.id,
                                children: []
                            });
                        }else{ // 这是权限
                            const secondMenuId = permissionMap.get(item.parentId); // 单纯获取获取二级菜单的id
                            const firstMenuIndex  = firstMenuMap.get(secondMenuId); // 通过二级菜单获取一级菜单的下标

                            const indexPermissionIndex = iMap.get(item.parentId);
                            parent[firstMenuIndex].children[indexPermissionIndex].children.push({
                                label: item.description,
                                value: item.id,
                                id: item.id,
                                children: []
                            })
                        }
                    }
                });
                return Object.values(parent);
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
