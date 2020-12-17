import request from '@/utils/request'
var group_name = 'log'
export default {
  listForPage(query) { // 分页查询
    return request({
      url: `/${group_name}/listForPage`,
      method: 'get',
      params: query
    })
  },
  deleteByIds(infoIds) { // 批量删除
    return request({
      url: `/${group_name}/deleteOperLogByIds/${infoIds}`,
      method: 'delete'
    })
  },
  deleteAll() { // 批量删除
    return request({
      url: `/${group_name}/clearAllOperLog`,
      method: 'delete'
    })
  }

}
