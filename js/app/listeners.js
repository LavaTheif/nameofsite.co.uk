$(document).ready(function (){
  loadData();

  $('#board').on('change', updateSidebarView);
  $('#filter').on('change', updateSidebarFilter);
});
