<?php

function tinh_tuoi($ngay_sinh) {
  $hom_nay = date("Y-m-d");
  $chenh_lech = date_diff(date_create($ngay_sinh), date_create($hom_nay));
  return $chenh_lech->y;
}


if (isset($_POST['submit'])) {
  $ten_nguoi1 = $_POST['ten_nguoi1'];
  $ngay_sinh_nguoi1 = $_POST['ngay_sinh_nguoi1'];
  $ten_nguoi2 = $_POST['ten_nguoi2'];
  $ngay_sinh_nguoi2 = $_POST['ngay_sinh_nguoi2'];

  
  $tuoi_nguoi1 = tinh_tuoi($ngay_sinh_nguoi1);
  $tuoi_nguoi2 = tinh_tuoi($ngay_sinh_nguoi2);

 
  $ngay1 = date_create($ngay_sinh_nguoi1);
  $ngay2 = date_create($ngay_sinh_nguoi2);
  $chenh_lech = date_diff($ngay1, $ngay2);
  $so_ngay_chenh_lech = $chenh_lech->days;

 
  echo "<h2>Kết Quả</h2>";
  echo "<p>Người 1: $ten_nguoi1, Tuổi: $tuoi_nguoi1</p>";
  echo "<p>Người 2: $ten_nguoi2, Tuổi: $tuoi_nguoi2</p>";
  echo "<p>Chênh lệch số ngày: $so_ngay_chenh_lech</p>";
} else {
  
  ?>
  <form method="post">
    <label for="ten_nguoi1">Tên Người 1:</label>
    <input type="text" id="ten_nguoi1" name="ten_nguoi1"><br><br>
    <label for="ngay_sinh_nguoi1">Ngày Sinh Người 1:</label>
    <input type="date" id="ngay_sinh_nguoi1" name="ngay_sinh_nguoi1"><br><br>
    <label for="ten_nguoi2">Tên Người 2:</label>
    <input type="text" id="ten_nguoi2" name="ten_nguoi2"><br><br>
    <label for="ngay_sinh_nguoi2">Ngày Sinh Người 2:</label>
    <input type="date" id="ngay_sinh_nguoi2" name="ngay_sinh_nguoi2"><br><br>
    <input type="submit" name="submit" value="Tính Toán">
  </form>
  <?php
}
?>