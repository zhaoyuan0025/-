import request from '@/utils/request'
var group_name = 'loginInfo'
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
      url: `/${group_name}/deleteLoginInfoByIds/${infoIds}`,
      method: 'delete'
    })
  },
  deleteAll() { // 清空
    return request({
      url: `/${group_name}/clearLoginInfo`,
      method: 'delete'
    })
  }

}
