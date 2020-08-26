$(document).ready(function() {
	
	/* ======= Sliding menu underline ====== */
	// Menu has active item
	//Ref: https://codepen.io/digistate/pen/OXXjXM
	 
	$nav = $("#navigation"),
	$slideLine = $("#slide-line"),
	$currentItem = $("#navigation li.active");
	

	$(window).on('resize load', function() {
		
		if ($currentItem[0]) {
			$slideLine.css({
			  "width": $currentItem.width(),
			  "left": $currentItem.position().left
			});
		}
	});
	
	// Underline transition
	$nav.find("li").hover(
		// Hover on
		function(){
		  $slideLine.css({
		    "width": $(this).width(),
		    "left": $(this).position().left
		  });
		},
		// Hover out
		function(){
		  if ($currentItem[0]) {
		    // Go back to current
		    $slideLine.css({
		      "width": $currentItem.width(),
		      "left": $currentItem.position().left
		    });
		  } else {
		    // Disapear
		    $slideLine.width(0);
		  }
		}
	);
    

});