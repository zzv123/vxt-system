/* 返回保存数据工具函数 */
async function set(key, data) {
  await uni.setStorage({
    key,
    data: JSON.stringify(data),
  });
}

async function get(key) {
  return new Promise((resolve, reject) => {
    uni.getStorage({
      key,
      success: function (res) {
        resolve(JSON.parse(res.data));
      },
      fail: function (e) {
        resolve(null);
      },
    });
  });
}

module.exports = {
  set,
  get,
}