<template>
  <div class="app-container">
    <!-- 查询条件开始 -->
    <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
      <el-form-item label="系统模块" prop="title">
        <el-input
          v-model="queryParams.title"
          placeholder="请输入系统模块"
          clearable
          size="small"
          style="width:200px"
        />
      </el-form-item>
      <el-form-item label="操作人员" prop="operName">
        <el-input
          v-model="queryParams.operName"
          placeholder="请输入操作人员"
          clearable
          size="small"
          style="width:200px"
        />
      </el-form-item>
      <el-form-item label="操作类型" prop="businessType">
        <el-select
          v-model="queryParams.businessType"
          placeholder="请选择类型"
          clearable
          size="small"
          style="width:200px"
        >
          <el-option
            v-for="dict in businessTypeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
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

      <el-form-item label="创建时间">
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
        <el-button type="normal" icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 查询条件结束 -->
    <!-- 工具栏开始 -->
    <el-row :gutter="10" style="margin-bottom: 8px;">
      <el-col :span="1.5">
        <el-button type="danger" icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" icon="el-icon-thumb" size="mini" @click="handleClearInfo">清空</el-button>
      </el-col>
    </el-row>
    <!-- 工具栏结束 -->

    <!-- 数据表格开始 -->
    <el-table v-loading="loading" border :data="operLogTableList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="操作模块">
              <span>{{ props.row.title }}</span>
            </el-form-item>
            <el-form-item label="登陆信息">
              <span>{{ props.row.operName }} // {{ props.row.operIp }} // {{ props.row.operLocation }}</span>
            </el-form-item>
            <el-form-item label="请求地址">
              <span>{{ props.row.operUrl }}</span>
            </el-form-item>
            <el-form-item label="操作方法">
              <span>{{ props.row.requestMethod }}</span>
            </el-form-item>
            <el-form-item label="请求参数">
              <span>{{ props.row.operParam }}</span>
            </el-form-item>
            <el-form-item label="返回参数">
              <span>{{ props.row.jsonResult }}</span>
            </el-form-item>
            <el-form-item label="操作状态">
              <span>{{ props.row.status==0?'成功':'失败' }}</span>
            </el-form-item>
            <el-form-item label="操作时间">
              <span>{{ props.row.operTime }}</span>
            </el-form-item>
            <el-form-item label="异常信息">
              <span>{{ props.row.errorMsg }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="日志ID" align="center" prop="operId" />
      <el-table-column label="系统模块" align="center" prop="title" />
      <el-table-column label="操作类型" align="center" prop="businessType" :formatter="businessTypeFormatter" />
      <el-table-column label="请求方式" width="180" align="center" prop="requestMethod" />
      <el-table-column label="操作人员" align="center" prop="operName" />
      <el-table-column label="主机" align="center" prop="operIp" />
      <el-table-column label="操作地点" align="center" prop="operLocation" />
      <el-table-column label="操作状态" prop="status" align="center" :formatter="statusFormatter" />
      <el-table-column label="操作时间" align="center" prop="operTime" width="200" />
      <el-table-column label="操作" align="center" width="100">
        <template slot-scope="scope">
          <el-button v-if="scope.row.userId!=1" type="text" icon="el-icon-delete" size="mini" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 数据表格结束 -->

    <!-- 分页控件开始 -->
    <el-pagination
      v-show="total>0"
      :current-page="queryParams.pageNum"
      :page-sizes="[5,10,20,30]"
      :page-size="queryParams.pageSize"
      layout="total,sizes,prev,pager,next,jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <!-- 分页控件结束 -->
  </div>
</template>

<script>
import operLogApi from '@/api/system/log/operLog'
export default {
  data() {
    return {
      // 遮罩层
      loading: false,
      // 选中多条
      multiple: true,
      // 选中数组
      ids: [],
      // 总条数
      total: 0,
      // 用户数据数据
      operLogTableList: [],
      // 状态数据字典
      statusOptions: [],
      // 登陆类型数据字典
      businessTypeOptions: [],
      // 时间
      dateRange: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        title: undefined,
        operName: undefined,
        status: undefined,
        businessType: undefined
      }
    }
  },
  // 加载页面时加载数据
  created() {
    // 加载查询的条件
    this.getDataByType('sys_normal_disable').then(res => {
      this.statusOptions = res.data
    })

    // 加载操作类型
    this.getDataByType('sys_oper_type').then(res => {
      this.businessTypeOptions = res.data
    })

    // 进入页面加载数据
    this.getOperLogList()
  },
  methods: {
    getOperLogList() {
      this.loading = true
      operLogApi.listForPage(this.queryParams).then(res => {
        this.operLogTableList = res.data
        this.total = res.total
        this.loading = false
      })
    },

    // 分页的数据监听显示
    handleSizeChange(val) {
      this.queryParams.pageSize = val
      this.getOperLogList()
    },
    // 页码的变化
    handleCurrentChange(val) {
      this.queryParams.pageNum = val
      this.getOperLogList()
    },
    // 模糊查询
    handleQuery() {
      this.getOperLogList()
    },
    // 删除
    handleDelete() {

    }
  }
}
</script>
<style scoped>

</style>
