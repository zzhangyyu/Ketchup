var networkUtil = require("../common/js/network.js");
Page({
  data: {
    pageIdx: 1,
    prescriptionList: [],
    isLastPage: false,
    clearIconShow: false
  },
  onLoad: function () {

  },
  onSearchSuccess: function (data, requestCode) {
    var that = this;
    var internetData = data.content;
    if (internetData == null || internetData.length == 0) {
      wx.showToast({
        title: '没查到内容，换个名字吧~',
        icon: 'none',
        duration: 2000,
        mask: true
      })
    }
    that.setData({
      pageIdx: 1,
      isLastPage: true,
      prescriptionList: internetData
    });
  },
  /**
   * 获取数据失败事件
   */
  onSearchFail: function (data, requestCode) {
    var that = this;
    that.setData({
      prescriptionList: data.content
    });
  },
  /**
   * 搜索框点击事件
   */
  search: function (e) {
    var that = this;
    var prescriptionLike = that.data.searchValue;
    if (prescriptionLike == null || prescriptionLike.trim() == '') {
      that.clear();
      wx.showToast({
        title: '请输入查询内容',
        icon: 'none',
        duration: 2000,
        mask: true
      });
      return;
    }
    var reqJson = {
      "content": {
        "prescriptionLike": prescriptionLike,
        "pageIdx": "1",
        "recordPerPage": getApp().globalData.recordPerPage
      },
      "os": getApp().globalData.os,
      "phone": getApp().globalData.phone,
      "version": getApp().globalData.version
    };
    networkUtil.postJson(getApp().globalData.baseUrl + "patient/getConsiliaPrescriptionDir", reqJson, "正在加载...", that.onSearchSuccess, that.onSearchFail);
  },
  /**
   * 搜索框文字变化监听事件
   */
  searchValueInput: function (e) {
    var that = this;
    var value = e.detail.value;
    that.setData({
      searchValue: value,
    });
    if (value == null || value == '') {
      that.setData({
        clearIconShow: false
      });
      that.onPullDownRefresh();
    } else {
      that.setData({
        clearIconShow: true
      });
    }
  },
  /**
   * 搜索框清除按钮点击事件
   */
  clear: function (e) {
    this.setData({
      clearIconShow: false,
      searchValue: ''
    });
  }
})