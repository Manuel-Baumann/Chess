class Bishop{
  constructor(isWhite){
    this.isWhite = isWhite;

    var bishopW = new Image();
    bishopW.src = './Images/bishopWhite.png';

    var bishopB = new Image();
    bishopB.src = './Images/bishopBlack.png';

    this.bishopB = bishopB;
    this.bishopW = bishopW;

    this.xOffset = 0;
  }

  pieceClicked(Tiles, tileX, tileY){

    let possMoves = [];

    //Going through all 4 Directions
    //LeftUp
    for(let i=1;i<Math.min(tileX+1, tileY+1);i++){
      //If no Piece on Tile
      if(Tiles[tileX-i][tileY-i] == 0){
        possMoves.push([tileX-i, tileY-i]);
      }
      //If Piece on Tile
      else{
        //If Piece is different Color
        if(Tiles[tileX-i][tileY-i].isWhite != this.isWhite){
          possMoves.push([tileX-i, tileY-i]);
        }
        break;
      }
    }

    //LeftDown
    for(let i=1;i<Math.min(tileX+1, 8-tileY);i++){

      //If no Piece on Tile
      if(Tiles[tileX-i][tileY+i] == 0){
        possMoves.push([tileX-i, tileY+i]);
      }
      //If Piece on Tile
      else{
        //If Piece is different Color
        if(Tiles[tileX-i][tileY+i].isWhite != this.isWhite){
          possMoves.push([tileX-i, tileY+i]);
        }
        break;
      }
    }
    //RightUp
    for(let i=1;i<Math.min(8-tileX, tileY+1);i++){
      //If no Piece on Tile
      if(Tiles[tileX+i][tileY-i] == 0){
        possMoves.push([tileX+i, tileY-i]);
      }
      //If Piece on Tile
      else{
        //If Piece is different Color
        if(Tiles[tileX+i][tileY-i].isWhite != this.isWhite){
          possMoves.push([tileX+i, tileY-i]);
        }
        break;
      }
    }
    //RightDown
    for(let i=1;i<Math.min(8-tileX, 8-tileY);i++){
      //If no Piece on Tile
      if(Tiles[tileX+i][tileY+i] == 0){
        possMoves.push([tileX+i, tileY+i]);
      }
      //If Piece on Tile
      else{
        //If Piece is different Color
        if(Tiles[tileX+i][tileY+i].isWhite != this.isWhite){
          possMoves.push([tileX+i, tileY+i]);
        }
        break;
      }
    }
    return possMoves;
  }

  draw(context, tileSize, x, y){
    if(this.isWhite){
      context.drawImage(this.bishopW, x*tileSize + this.xOffset, y*tileSize, tileSize, tileSize);
    }
    else{
      context.drawImage(this.bishopB, x*tileSize + this.xOffset, y*tileSize, tileSize, tileSize);
    }
  }
}
