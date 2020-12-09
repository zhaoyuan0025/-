import request from '@/utils/request'
var group_name = 'dictData'
export default {
  listForPage(query) { // 分页查询
    return request({
      url: `/${group_name}/listForPage`,
      method: 'get',
      params: query
    })
  },
  addDictData(data) { // 添加
    return request({
      url: `/${group_name}/addDictData`,
      method: 'post',
      params: data
    })
  },
  updateDictData(data) { // 修改
    return request({
      url: `/${group_name}/updateDictData`,
      method: 'put',
      params: data
    })
  },
  getDictData(dictId) { // 根据id查询
    return request({
      url: `/${group_name}/getDictData/${dictId}`,
      method: 'get'
    })
  },
  deleteByIds(dictCodeIds) { // 批量删除
    return request({
      url: `/${group_name}/deleteByIds/${dictCodeIds}`,
      method: 'delete'
    })
  },
  selectAllDictType() { // 根据id查询
    return request({
      url: `/${group_name}/selectAllDictType`,
      method: 'get'
    })
  },
  deleteById(id) { // 根据id删除
    return request({
      url: `/${group_name}/deleteById/${id}`,
      method: 'delete'
    })
  },
  getDataByType(dictType) { // 根据字典类型查询数据
    return request({
      url: `/${group_name}/getDataByType/${dictType}`,
      method: 'get'
    })
  }
}
