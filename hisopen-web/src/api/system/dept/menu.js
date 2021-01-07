import request from '@/utils/request'
var group_name = 'menu'
export default {
  listForPage(query) { // 分页查询
    return request({
      url: `/${group_name}/listAllMenus`,
      method: 'get',
      params: query
    })
  },
  selectMenuTree() { // 查询下拉菜单树
    return request({
      url: `/${group_name}/selectMenuTree`,
      method: 'get'
    })
  },
  addMenu(dept) { // 添加
    return request({
      url: `/${group_name}/addMenu`,
      method: 'post',
      data: dept
    })
  },
  updateMenu(data) { // 修改
    return request({
      url: `/${group_name}/updateMenu`,
      method: 'put',
      params: data
    })
  },
  getMenuById(id) { // 根据id查询
    return request({
      url: `/${group_name}/getById/${id}`,
      method: 'get'
    })
  },
  deleteMenuById(id) { // 根据id删除
    return request({
      url: `/${group_name}/deleteMenuById/${id}`,
      method: 'delete'
    })
  }
  // ,
  // getMenuIdsByRoles(id) { // 根据角色id查询权限
  //   return request({
  //     url: `/${group_name}/getMenuIdsByRoles/${id}`,
  //     method: 'get'
  //   })
  // }

}
