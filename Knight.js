class Knight{
  constructor(isWhite){
    this.isWhite = isWhite;

    var knightW = new Image();
    knightW.src = './Images/knightWhite.png';

    var knightB = new Image();
    knightB.src = './Images/knightBlack.png';

    this.knightB = knightB;
    this.knightW = knightW;

    this.xOffset = 0;
  }

  pieceClicked(Tiles, tileX, tileY){
    let possMoves = [];

  	//Brute Forcing every move
  	if(tileY>1){
  	  if(tileX>0){
  	    if(Tiles[tileX-1][tileY-2].isWhite != this.isWhite){
  	      possMoves.push([tileX-1, tileY-2]);
  	    }
  	  }
  	  if(tileX<7){
  	    if(Tiles[tileX+1][tileY-2].isWhite != this.isWhite){
  	      possMoves.push([tileX+1, tileY-2]);
  	    }
  	  }
  	}
  	if(tileY>0){
  	  if(tileX>1){
  	    if(Tiles[tileX-2][tileY-1].isWhite != this.isWhite){
  	      possMoves.push([tileX-2, tileY-1]);
  	    }
  	  }
  	  if(tileX<6){
  	    if(Tiles[tileX+2][tileY-1].isWhite != this.isWhite){
  	      possMoves.push([tileX+2, tileY-1]);
  	    }
  	  }
  	}
  	if(tileY<6){
  	  if(tileX>0){
  	    if(Tiles[tileX-1][tileY+2].isWhite != this.isWhite){
  	      possMoves.push([tileX-1, tileY+2]);
  	    }
  	  }
  	  if(tileX<7){
  	    if(Tiles[tileX+1][tileY+2].isWhite != this.isWhite){
  	      possMoves.push([tileX+1, tileY+2]);
  	    }
  	  }
  	}
  	if(tileY<7){
  	  if(tileX>1){
  	    if(Tiles[tileX-2][tileY+1].isWhite != this.isWhite){
  	      possMoves.push([tileX-2, tileY+1]);
  	    }
  	  }
  	  if(tileX<6){
  	    if(Tiles[tileX+2][tileY+1].isWhite != this.isWhite){
  	      possMoves.push([tileX+2, tileY+1]);
  	    }
  	  }
  	}

    return possMoves;
  }

  draw(context, tileSize, x, y){
    if(this.isWhite){
      context.drawImage(this.knightW, x*tileSize + this.xOffset, y*tileSize, tileSize, tileSize);
    }
    else{
      context.drawImage(this.knightB, x*tileSize + this.xOffset, y*tileSize, tileSize, tileSize);
    }
  }
}
