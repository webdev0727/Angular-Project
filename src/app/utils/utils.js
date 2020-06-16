exports.formatDate = function(d) {
  if (!d) {
    return '';
  }
  d = new Date(d);
  const month = `0${(d.getMonth() + 1)}`;
  const day = `0${d.getDate()}`;
  const year = d.getFullYear();
  return [month.slice(-2), day.slice(-2), year].join('/');
};


exports.getNextXDays = function(n) {
  const date = new Date();
  date.setDate(date.getDate() + n);

  return this.formatDate(date);
}

exports.getFormData = function(obj) {
  const formData  = new FormData();
  Object.keys(obj).forEach(function(key) {
    formData.append(key, obj[key]);
});
return formData;
}
