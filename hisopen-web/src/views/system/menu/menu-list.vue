<template>
  <div>
    <!-- 查询条件 -->
    <!-- 查询条件开始 -->
    <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
      <el-form-item label="菜单名称" prop="menuName">
        <el-input
          v-model="queryParams.menuName"
          placeholder="请输入菜单名称"
          clearable
          size="small"
          style="width:240px"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="请选择状态"
          clearable
          size="small"
          style="width:200px"
        >
          <el-option
            v-for="dict in statusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button type="normal" icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        <el-button type="danger" icon="el-icon-plus" size="mini" @click="handleAdd">添加</el-button>
      </el-form-item>
    </el-form>

    <!-- 表格数据 -->
    <!-- 数据表格开始 -->
    <el-table
      v-loading="loading"
      border
      :data="menuTableList"
      row-key="menuId"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column label="菜单名称" align="left" prop="menuName" />
      <el-table-column label="菜单类型" align="center" prop="menuType">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.menuType==='M'?'primary':scope.row.menuType==='C'?'danger':'success'"
          >
            {{ scope.row.menuType==='M'?'目录':scope.row.menuType==='C'?'菜单':'权限' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="组件路径" align="center" prop="path" />
      <el-table-column label="权限标识" align="center" prop="percode" />
      <el-table-column label="状态" align="center" prop="status" :formatter="statusFormatter" />
      <el-table-column label="创建时间" align="center" prop="createTime" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-edit" size="mini" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button type="text" icon="el-icon-plus" size="mini" @click="handleAdd(scope.row)">添加</el-button>
          <el-button type="text" icon="el-icon-delete" size="mini" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>

    </el-table>

  </div>
</template>

<script>
import menuApi from '@/api/system/dept/menu'
export default {
  data() {
    return {
      // 遮罩层
      loading: false,
      // 菜单表的数据
      menuTableList: [],
      // 菜单树的数据
      menuOptions: [],
      // 弹出层的title
      title: '',
      // 是否打开弹出层
      open: false,
      // 状态数据字典
      statusOptions: [],
      // 查询参数
      queryParams: {
        menuName: undefined,
        status: undefined
      },
      // 表单数据
      form: {},
      // 表单校验
      rules: {
        menuName: [
          { required: true, message: '菜单名称不能为空', tirgger: 'blur' }
        ]
      }
    }
  },
  created() {
    // 查询状态字典数据
    this.getDataByType('sys_normal_disable').then(res => {
      this.statusOptions = res.data
    })

    this.getMenuList()
  },
  methods: {
    getMenuList() {
      this.loading = true
      menuApi.listForPage(this.queryParams).then(res => {
        this.menuTableList = this.handleTree(res.data, 'menuId')
        this.loading = false
      })
    },
    // 翻译登陆状态
    statusFormatter(row) {
      return this.selectDictLabel(this.statusOptions, row.status)
    },
    // 查询
    handleQuery() {
      this.getMenuList()
    },
    // 重置
    resetQuery() {
      this.resetForm('queryForm')
      this.getMenuList()
    }

  }
}
</script>
