<?php 

if(isset($_FILES['file']) and !$_FILES['file']['error']){
    $fname = $_POST['filename'].".wav";

    move_uploaded_file($_FILES['file']['tmp_name'], "./videos/" . $fname);
}
?>
