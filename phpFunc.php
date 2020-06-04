<?php
      function updateJSON($x){
        $contents = file_get_contents('tabla.json');
        $contentsDecoded = json_decode($contents, true);
        $contentsDecoded['nFilas']=$x;
        $json = json_encode($contentsDecoded);
        file_put_contents('tabla.json', $json);
      }


      if (isset($_POST['param'])) {
          updateJSON($_POST['param']);
      }
?>
