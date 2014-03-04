
<?php
//total hack, clean this up later
if (!isset($_GET['num'])){
	$_GET['num'] = 1;
} else {
	
}

$next = $_GET['num'] + 1;
if ($next == 7 ){
	$next = 1;
}

#var_dump($_SERVER);
#exit;


$nextUrl = $_SERVER['PHP_SELF'] ."?num=".$next;

?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
        "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
	<meta http-equiv="content-type" content="text/html; charset=macintosh" />
	<title>Jerome Foundation 50th <?php echo $_GET['num'];?>/6</title>
	<style type="text/css">
	body
{
	text-align: center;
	border:none;
	margin:0;
	padding:0;
}

	a img{
		border: 0;
	}

	</style>




</head>
<body>
	
	
<a href="<?php echo $nextUrl; ?>"><img src="<?php echo $_GET['num']; ?>.jpg?v=55" /></a>

</body>
</html>
