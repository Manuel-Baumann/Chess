class King{
  constructor(isWhite){
    this.isWhite = isWhite;

    var kingW = new Image();
    kingW.src = './Images/kingWhite.png';

    var kingB = new Image();
    kingB.src = './Images/kingBlack.png';

    this.kingB = kingB;
    this.kingW = kingW;

    this.xOffset = 0;
  }

  pieceClicked(Tiles, tileX, tileY){
    let possMoves = [];

  	//Brute Forcing every move
  	if(tileY>0){
  	  if(tileX>0){
  	    if(Tiles[tileX-1][tileY-1].isWhite != this.isWhite){
  	      possMoves.push([tileX-1, tileY-1]);
  	    }
  	  }
  	  if(Tiles[tileX][tileY-1].isWhite != this.isWhite){
  	    possMoves.push([tileX, tileY-1]);
  	  }
  	  if(tileX<7){
  	    if(Tiles[tileX+1][tileY-1].isWhite != this.isWhite){
  	      possMoves.push([tileX+1, tileY-1]);
  	    }
  	  }
  	}
  	if(tileY<7){
  	  if(tileX>0){
  		if(Tiles[tileX-1][tileY+1].isWhite != this.isWhite){
  	      possMoves.push([tileX-1, tileY+1]);
  	    }
  	  }
  	  if(Tiles[tileX][tileY+1].isWhite != this.isWhite){
  	    possMoves.push([tileX, tileY+1]);
  	  }
  	  if(tileX<7){
  	    if(Tiles[tileX+1][tileY+1].isWhite != this.isWhite){
  	      possMoves.push([tileX+1, tileY+1]);
  	    }
  	  }
  	}
  	if(tileX>0){
  	  if(Tiles[tileX-1][tileY].isWhite != this.isWhite){
  	    possMoves.push([tileX-1, tileY]);
  	  }
  	}
  	if(tileX<7){
  	  if(Tiles[tileX+1][tileY].isWhite != this.isWhite){
  	    possMoves.push([tileX+1, tileY]);
  	  }
  	}

    return possMoves;
  }

  draw(context, tileSize, x, y){
    if(this.isWhite){
      context.drawImage(this.kingW, x*tileSize + this.xOffset, y*tileSize, tileSize, tileSize);
    }
    else{
      context.drawImage(this.kingB, x*tileSize + this.xOffset, y*tileSize, tileSize, tileSize);
    }
  }
}
