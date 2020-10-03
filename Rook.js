class Rook{
  constructor(isWhite){
    this.isWhite = isWhite;

    var rookW = new Image();
    rookW.src = './Images/rookWhite.png';

    var rookB = new Image();
    rookB.src = './Images/rookBlack.png';

    this.rookB = rookB;
    this.rookW = rookW;

    this.xOffset = 0;
  }

  pieceClicked(Tiles, tileX, tileY){
    let possMoves = [];


    //Going through all 4 Directions
    //Left
    for(let i=1;i<tileX+1;i++){
      //If no Piece on Tile
      if(Tiles[tileX-i][tileY] == 0){
        possMoves.push([tileX-i, tileY]);
      }
      //If Piece on Tile
      else{
        //If Piece is different Color
        if(Tiles[tileX-i][tileY].isWhite != this.isWhite){
          possMoves.push([tileX-i, tileY]);
        }
        break;
      }
    }

    //Right
    for(let i=1;i<8-tileX;i++){
      //If no Piece on Tile
      if(Tiles[tileX+i][tileY] == 0){
        possMoves.push([tileX+i, tileY]);
      }
      //If Piece on Tile
      else{
        //If Piece is different Color
        if(Tiles[tileX+i][tileY].isWhite != this.isWhite){
          possMoves.push([tileX+i, tileY]);
        }
        break;
      }
    }
    //Up
    for(let i=1;i<tileY+1;i++){
      //If no Piece on Tile
      if(Tiles[tileX][tileY-i] == 0){
        possMoves.push([tileX, tileY-i]);
      }
      //If Piece on Tile
      else{
        //If Piece is different Color
        if(Tiles[tileX][tileY-i].isWhite != this.isWhite){
          possMoves.push([tileX, tileY-i]);
        }
        break;
      }
    }
    //Down
    for(let i=1;i<8-tileY;i++){
      //If no Piece on Tile
      if(Tiles[tileX][tileY+i] == 0){
        possMoves.push([tileX, tileY+i]);
      }
      //If Piece on Tile
      else{
        //If Piece is different Color
        if(Tiles[tileX][tileY+i].isWhite != this.isWhite){
          possMoves.push([tileX, tileY+i]);
        }
        break;
      }
    }

    return possMoves;
  }

  draw(context, tileSize, x, y){
    if(this.isWhite){
      context.drawImage(this.rookW, x*tileSize + this.xOffset, y*tileSize, tileSize, tileSize);
    }
    else{
      context.drawImage(this.rookB, x*tileSize + this.xOffset, y*tileSize, tileSize, tileSize);
    }
  }
}
