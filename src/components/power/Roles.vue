<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加角色按钮区 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addDialogVisible = true">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色列表区 -->
      <el-table
      :data="rolelist"
      border
      stripe>
      <!-- border显示边框，stripe斑马纹 -->
        <el-table-column
        type="expand"
        label="展开权限">
        <!-- expand表示可以展开 -->
        <!-- 自定义模板 -->
          <template slot-scope="scope">
            <!-- scope.row表示获取当前改行数据 -->
            <el-row v-for="(item1, i1) in scope.row.children" :key="item1.id" :class="['bdbottom',i1==0 ? 'bdtop':'','vcenter']">
              <el-col :span="5">
                <el-tag 
                closable
                @close='removeRightById(scope.row,item1.id)'>{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <el-row v-for="(item2,i2) in item1.children" :key="item2.id" :class="[i2 !== 0 ? 'bdtop': '','vcenter']">
                  <el-col :span="6">
                    <el-tag type="success" 
                    closable
                    @close='removeRightById(scope.row,item2.id)'>{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag v-for="(item3,i3) in item2.children" 
                    :key="item3.id" 
                    :class="[i3 == 0 ? '' : 'bdtop']"
                    type="warning"
                    closable
                    @close='removeRightById(scope.row,item3.id)'>
                      {{item3.authName}}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column
        type="index"
        label="#">
        </el-table-column>
        <el-table-column
        label="角色名称"
        prop="roleName">
        </el-table-column>
        <el-table-column
        label="角色描述"
        prop="roleDesc">
        </el-table-column>
        <el-table-column
        label="操作"
        width="300px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row.id)">删除</el-button>
            <el-button type="warning" icon="el-icon-setting" size="mini" @click="showSetRightDialog(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 添加角色的对话框 -->
      <el-dialog
        title="添加角色"
        :visible.sync="addDialogVisible"
        width="50%"
        @close='addDialogClosed'
        >
        <el-form 
        :model="addForm" 
        :rules="addFormRules" 
        ref="addFormRef" 
        label-width="100px">
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="addForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="addForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addRole">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 编辑角色对话框 -->
      <el-dialog
        title="编辑角色"
        :visible.sync="editDialogVisible"
        width="50%"
        @close='editDialogClosed'
        >
        <el-form 
        :model="editForm" 
        :rules="editFormRules" 
        ref="editFormRef" 
        label-width="100px">
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="editForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="editForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editRoleInfo">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 分配权限的对话框 -->
      <el-dialog
        title="分配角色"
        :visible.sync="setRightDialogVisible"
        width="50%"
        @close='setRightDialogClosed'>
        <el-tree 
        :data="rightsList" 
        :props="treeProps" 
        show-checkbox 
        node-key='id'
        default-expand-all
        :default-checked-keys="defKeys"
        ref="treeRef">
        </el-tree>
        <span slot="footer" class="dialog-footer">
          <el-button @click="setRightDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="allotRights">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return{
       //所有角色列表数据
      rolelist: [],
      editForm: {},
      rightsList: [],
      //控制添加角色对话框的显示
      addDialogVisible: false,
      //控制编辑角色对话框的显示
      editDialogVisible: false,
      //控制分配角色对话框的显示
      setRightDialogVisible: false,
      addForm: {
        roleName: '',
        roleDesc: '',
      },
      addFormRules: {
        roleName: [
            { required: true, message: '请输入角色名称', trigger: 'blur' },
            { min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur' }
          ],
        roleDesc: [
            { required: true, message: '请输入角色描述', trigger: 'blur' }
          ]
      },
      editFormRules: {
        roleName: [
            { required: true, message: '请输入角色名称', trigger: 'blur' },
            { min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur' }
          ],
        roleDesc: [
            { required: true, message: '请输入角色描述', trigger: 'blur' }
          ]
      },
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      defKeys:[],
      roleId: '',
    }
  },
  created() {
    this.getRolesList()   //获取角色列表
  },
  methods: {
    //获取所有角色列表
    async getRolesList(){
      const { data:res } = await this.$http.get('roles')
      if(res.meta.status !== 200) return this.$message.error('获取角色列表失败')
      this.rolelist = res.data
      console.log(res);
    },
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    editDialogClosed(){
      this.$refs.editFormRef.resetFields()
    },
    addRole() {
      this.$refs.addFormRef.validate( async valid => {
        if(!valid) return
        const { data:res } = await this.$http.post('roles',this.addForm)
        if(res.meta.status !== 201) return this.$message.error('添加角色失败!')
        this.$message.success('添加用户成功!')
        this.addDialogVisible = false
        this.getRolesList()
      }
      )
    },
    async showEditDialog(id){
      const { data:res} = await this.$http.get('roles/'+ id)
      if(res.meta.status !== 200) return this.$message.error('查询用户信息失败！')
      this.editForm = res.data
      this.editDialogVisible = true
    },
    editRoleInfo() {
      this.$refs.editFormRef.validate(async valid => {
        if(!valid)  return
        const { data:res } = await this.$http.put('roles/'+ this.editForm.roleID)
        if(res.meta.status !== 200) return this.$message.error('修改角色失败')
        this.$message.success('修改角色成功')
        this.editDialogVisible = false
        this.getRolesList()
      })
    },
    async removeUserById(id){
      const confirmresult = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).catch(err => err)
      if(confirmresult !== 'confirm') return this.$message.info('已取消删除')
      const { data: res } = await this.$http.delete('roles/' + id)
      if(res.meta.status !== 200){
        return this.$message.error('删除用户失败！')
      }
      this.$message.success('删除用户成功')
      this.getRolesList()
    },
    async removeRightById(role,rightid){
       const confirmresult = await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).catch(err => err)
        if(confirmresult !== 'confirm') return this.$message.info('已取消删除')
        const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rightid}`)
        if(res.meta.status !== 200){
          return this.$message.error('删除权限失败！')
        }
        this.$message.success('删除用户成功')
        //返回的是当前角色下的最新数据
        role.children = res.data
    },
    async showSetRightDialog(role) {
      this.roleId = role.id
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限列表失败!')
      }
      this.rightsList = res.data
      this.getLeafKeys(role, this.defKeys)
      this.setRightDialogVisible = true
    },
    //递归函数
    getLeafKeys(node, arr) {
      // 如果当前node没有children属性则是三级节点,向数组中push id
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => this.getLeafKeys(item, arr))
    },
    setRightDialogClosed(){
      this.defKeys = []
    },
    //点击为角色分配权限
    async allotRights() {
      const keys = [...this.$refs.treeRef.getCheckedKeys(),...this.$refs.treeRef.getHalfCheckedKeys()]
      // console.log(keys);
      const idStr = keys.join(',')
      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`,{rids:idStr})
      if(res.meta.status !== 200) return this.$message.error('分配权限失败')
      this.$message.success('分配权限成功')
      this.getRolesList()
      this.setRightDialogVisible = false
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag{
  margin: 7px;
}
.bdtop{
  border-top: 1px solid #eee;
}
.bdbottom{
  border-bottom: 1px solid #eee;
}
.vcenter{
  display: flex;
  align-items: center;
}
</style>