class Pawn{
  constructor(isWhite){
    this.isWhite = isWhite;

    this.pawnW = new Image();
    this.pawnW.src = './Images/pawnWhite.png';

    this.pawnB = new Image();
    this.pawnB.src = './Images/pawnBlack.png';

    this.xOffset = 0;
  }

  pieceClicked(Tiles, tileX, tileY){
    let possMoves = [];


    //For white Pawns
  	if(this.isWhite){
  	  //Pushing
  	  switch(tileY){
  		  case 6:
  		    possMoves.push([tileX, tileY-2]);
  		  case 5:
  		  case 4:
  		  case 3:
  		  case 2:
  		  case 1:
  		    possMoves.push([tileX, tileY-1]);
  	  }
  	  //If two in Front
  	  if(tileY>1){
        if(Tiles[tileX][tileY-2] != 0){
  		     possMoves = [[tileX, tileY-1]];
        }
      }
  	  //If one in Front
      if(tileY>0){
        if(Tiles[tileX][tileY-1] != 0){
    		  possMoves = [];
    	  }
      }

  	  //Capturing
      if(tileX>0 && tileY>0){
        if(Tiles[tileX-1][tileY-1] != 0){
    	    if(!Tiles[tileX-1][tileY-1].isWhite){
    		    possMoves.push([tileX-1, tileY-1]);
          }
    	  }
      }
      if(tileX<7 && tileY>0){
        if(Tiles[tileX+1][tileY-1] != 0){
    		    if(!Tiles[tileX+1][tileY-1].isWhite){
    		      possMoves.push([tileX+1, tileY-1]);
    		    }
    	    }
        }
  	  }
  	  //For Blacks Pawns
  	  else{
  	    //Pushing
  	    switch(tileY){
  		  case 1:
  		    possMoves.push([tileX, tileY+2]);
  		  case 2:
  		  case 3:
  		  case 4:
  		  case 5:
  		  case 6:
  		    possMoves.push([tileX, tileY+1]);
  	    }
  	    //If two in Front
        if(tileY<6){
    	    if(Tiles[tileX][tileY+2] != 0){
    		    possMoves = [[tileX, tileY+1]];
    	    }
        }
  	    //If one in Front
  	    if(tileY<7){
          if(Tiles[tileX][tileY+1] != 0){
    		    possMoves = [];
    	    }
        }

  	    //Capturing
        if(tileX<7 && tileY<7){
          if(Tiles[tileX+1][tileY+1] != 0){
    		    if(Tiles[tileX+1][tileY+1].isWhite){
    		      possMoves.push([tileX+1, tileY+1]);
    		    }
    	    }
        }
        if(tileX>0 && tileY<7){
          if(Tiles[tileX-1][tileY+1] != 0){
    		    if(Tiles[tileX-1][tileY+1].isWhite){
    	  	    possMoves.push([tileX-1, tileY+1]);
    		    }
    	    }
        }
  	  }
    return possMoves;
  }

  draw(context, tileSize, x, y){
    if(this.isWhite){
      context.drawImage(this.pawnW, x*tileSize + this.xOffset, y*tileSize, tileSize, tileSize);
    }
    else{
      context.drawImage(this.pawnB, x*tileSize + this.xOffset, y*tileSize, tileSize, tileSize);
    }
  }
}
