let arr = [
    {id: 7, file: 'Note3_thuchanh.pdf', num_pages: 9, file_format: 'pdf', created_at: '2024-09-06T14:25:08.143547Z'},
    {id: 8, file: 'Note1_thuchanh1.pdf', num_pages: 18, file_format: 'pdf', created_at: '2024-09-06T14:34:51.030884Z'},
    {id: 9, file: '%C4%90%E1%BB%80_TH%C3%81NG_7_2024.pdf', num_pages: 4, file_format: 'pdf', created_at: '2024-09-09T14:38:14.835770Z'},
    {id: 10, file: 'NguyenDinhThai_Exercise10_Week4.ipynb_-_Colab.pdf', num_pages: 7, file_format: 'pdf', created_at: '2024-09-13T18:43:24.936253Z'}
  ];
  
  // Xóa phần tử tại vị trí 2 (index 2)
  arr.splice(2, 1);
  
  console.log(arr);
  