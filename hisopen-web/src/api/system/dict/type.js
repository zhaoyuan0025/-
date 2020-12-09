import request from '@/utils/request'
var group_name = 'dict'
export default {
  listForPage(query) { // 分页查询
    return request({
      url: `/${group_name}/listForPage`,
      method: 'get',
      params: query
    })
  },
  addDictType(type) { // 添加
    return request({
      url: `/${group_name}/addDictType`,
      method: 'post',
      data: type
    })
  },
  updateDictType(data) { // 修改
    return request({
      url: `/${group_name}/updateDictType`,
      method: 'put',
      params: data
    })
  },
  getDictTypeById(dictId) { // 根据id查询
    return request({
      url: `/${group_name}/getDictType/${dictId}`,
      method: 'get'
    })
  },
  deleteByIds(dictIds) { // 批量删除
    return request({
      url: `/${group_name}/deleteByIds/${dictIds}`,
      method: 'delete'
    })
  },
  deleteById(id) { // 根据id删除
    return request({
      url: `/${group_name}/deleteById/${id}`,
      method: 'delete'
    })
  },
  dictCacheAsync() { // 缓存同步查询
    return request({
      url: `/${group_name}/dictCacheAsync`,
      method: 'get'
    })
  },
  selectAllDictType() { // 查询所有的,不分页
    return request({
      url: `/${group_name}/selectAllDictType`,
      method: 'get'
    })
  }
}
