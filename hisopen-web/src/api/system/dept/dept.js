import request from '@/utils/request'
var group_name = 'dept'
export default {
  listForPage(query) { // 分页查询
    return request({
      url: `/${group_name}/listDeptForPage`,
      method: 'get',
      params: query
    })
  },
  selectAllDept() { // 查询全部有效的
    return request({
      url: `/${group_name}/selectAllDept`,
      method: 'get'
    })
  },
  addDept(dept) { // 添加
    return request({
      url: `/${group_name}/addDept`,
      method: 'post',
      data: dept
    })
  },
  updateDept(data) { // 修改
    return request({
      url: `/${group_name}/updateDept`,
      method: 'put',
      params: data
    })
  },
  getDeptById(deptId) { // 根据id查询
    return request({
      url: `/${group_name}/getDeptById/${deptId}`,
      method: 'get'
    })
  },
  deleteByIds(deptIds) { // 批量删除
    return request({
      url: `/${group_name}/deleteDeptByIds/${deptIds}`,
      method: 'delete'
    })
  }

}
