<template>
  <div class="app-container">
    <!-- 查询条件 -->
    <el-form ref="page" :model="page" :inline="true" label-width="68px">
      <el-form-item size="mini" label="字典名称" prop="dictName">
        <el-input
          v-model="page.dictName"
          placeholder="请输入字典名称"
          clearable
          size="small"
          style="width:240px"
        />
      </el-form-item>
      <el-form-item size="mini" label="字典类型" prop="dictType">
        <el-input
          v-model="page.dictType"
          placeholder="请输入字典类型"
          clearable
          size="small"
          style="width:240px"
        />
      </el-form-item>
      <el-form-item size="mini" label="状态" label-width="42px" prop="status">
        <el-select
          v-model="page.status"
          placeholder="字典状态"
          clearable
          size="small"
          style="width:240px"
        >
          <el-option
            v-for="dict in statusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item size="mini" label="创建时间">
        <el-date-picker
          v-model="dateRange"
          size="small"
          style="width:240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholde="开始日期"
          end-placeholde="结束日期"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button type="primary" icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-divider content-position="center">刘小少</el-divider>

    <!-- 按钮 -->
    <el-row :gutter="10" style="margin-bottom: 8px;">
      <el-col :span="1.5">
        <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd">新增</el-button>
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
        >修改</el-button>
      </el-col> -->
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
        >批量删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" icon="el-icon-refresh" size="mini" @click="handleCacheAsync">缓存同步</el-button>
      </el-col>
    </el-row>
    <!-- 表格数据 -->
    <el-table v-loading="loading" border :data="list" @selection-change="handleSelectionChnage">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="字典编号" prop="dictId" align="center" />
      <el-table-column label="字典名称" prop="dictName" align="center" :show-overflow-tooltip="true" />
      <el-table-column label="字典类型" prop="dictType" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <router-link :to="'/dict/data/' + scope.row.dictId" class="link-type">
            <span>{{ scope.row.dictType }}</span>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="status" align="center" :formatter="statusFormatter" />
      <el-table-column label="备注" prop="remark" align="center" :show-overflow-tooltip="true" />
      <el-table-column label="创建时间" prop="createTime" align="center" width="180" />
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-edit" size="mini" @click="handleUpdate(scope.row.dictId)">修改</el-button>
          <el-button
            type="text"
            icon="el-icon-delete"
            size="mini"
            @click="handleDelete(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      v-show="total>0"
      :current-page="page.pageNum"
      :page-sizes="[5, 10, 20, 30]"
      :page-size="page.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

    <!-- 打开添加的弹窗 -->
    <el-dialog title="添加" :visible.sync="dialog" width="30%">
      <type-add @getTypeList="getTypeList" @reset="reset" @closeAddDialog="closeAddDialog" />
    </el-dialog>

    <!-- 打开修改的弹窗 -->
    <el-dialog title="更新" :visible.sync="updateDialog" width="30%">
      <type-update :form="form" @getTypeList="getTypeList" @closeUpdateDialog="closeUpdateDialog" />
    </el-dialog>
  </div>
</template>

<script>
import typeApi from '@/api/system/dict/type'
import TypeAdd from './type-add'
import TypeUpdate from './type-update'
export default {
  components: {
    TypeAdd,
    TypeUpdate
  },
  data() {
    return {
      loading: false, // 是否启用遮罩层
      updateDialog: false, // 控改弹窗的显示制修
      ids: [], // 选中数组
      // single: true, // 非单个禁用
      multiple: true, // 非多个禁用
      total: 0, // 分页数据总条数
      list: [], // 字典表格数据
      title: '', // 弹出层标题
      dialog: false, // 是否显示弹出层
      statusOptions: [], // 状态数据字典
      dateRange: [], // 日期范围
      // 查询参数
      page: {
        pageNum: 1,
        pageSize: 10,
        dictName: undefined,
        dictType: undefined,
        status: undefined
      },
      // 表单数据
      form: {},
      // 表单校验
      rules: {
        dictName: [
          { required: true, message: '字典名称不能为空', trigger: 'blur' }
        ],
        dictType: [
          { required: true, message: '字典类型不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getTypeList()
    // 使用全局的根据字典类型查询字典数据的方法查询字典数据
    this.getDataByType('sys_normal_disable').then(res => {
      this.statusOptions = res.data
    })
  },
  methods: {
    getTypeList() {
      this.loading = true
      typeApi.listForPage(this.page).then((res) => {
        this.list = res.data
        this.total = res.total
        this.loading = false
      })
    },
    // 分页pageSize变化时触发
    handleSizeChange(val) {
      this.page.pageSize = val
      this.getTypeList()
    },
    // 点击上一页  下一页，跳转到哪一页面时触发
    handleCurrentChange(val) {
      this.page.pageNum = val
      this.getTypeList()
    },
    // 添加
    handleAdd() {
      // 打开之前重置表单
      this.dialog = true
    },
    // 关闭添加的弹窗
    closeAddDialog() {
      this.dialog = false
    },
    // 模糊查询搜索
    handleQuery() {
      this.getTypeList()
    },
    // 状态翻译
    statusFormatter(row) {
      // 第一个值是翻译成的值  第二个状态是需要翻译的数字
      return this.selectDictLabel(this.statusOptions, row.status)
    },
    // 批量选择时触发
    handleSelectionChnage(selection) {
      this.ids = selection.map(item => item.dictId)
      // this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    // 修改
    handleUpdate(id) {
      // console.log(this.form)
      typeApi.getDictTypeById(id).then(res => {
        this.form = res.data
        this.updateDialog = true
      })
    },
    // 关闭修改弹窗
    closeUpdateDialog() {
      this.updateDialog = false
    },
    // 重值查询条件
    resetQuery() {
      this.resetForm('page')
      this.dateRange = []
      this.getTypeList()
    },
    // 数据表格的多选择框选择时触发
    // 批量删除
    handleDelete(row) {
      const dictIds = row.dictId || this.ids
      this.$confirm('此操作将永久删除数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        typeApi.deleteByIds(dictIds).then(res => {
          this.loading = false
          this.msgSuccess('删除成功！')
          this.getTypeList()
        })
      }).catch(() => {
        this.msgError('删除已取消')
        this.loading = false
      })
    },
    // 缓存同步
    handleCacheAsync() {
      this.loading = true
      typeApi.dictCacheAsync().then(res => {
        this.loading = true
        this.msgSuccess('缓存同步成功')
        this.getTypeList()
      })
    },
    // 重置表单
    reset() {
      this.form = {
        dictId: undefined,
        dictName: undefined,
        dictType: undefined,
        status: '0',
        remark: undefined
      }
      this.resetForm('form')
    }
  }
}
</script>

<style>
</style>
