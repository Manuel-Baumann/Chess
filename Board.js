/*
Board consists of 64 Tiles, saved in Tiles-Array

00  10  20  30  40  50  60  70
01  11  21  31  41  51  61  71
02  12  22  32  42  52  62  72
03  13  23  33  43  53  63  73
04  14  24  34  44  54  64  74
05  15  25  35  45  55  65  75
06  16  26  36  46  56  66  76
07  17  27  37  47  57  67  77
*/


class Board{
  constructor(){
    this.lightColor = "#694a00";
    this.darkColor = "#9e8400";
    this.Tiles = [[0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0],
                  [0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0],
                  [0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0]];
    this.selectedPiece = [];
    this.possMoves = [];
    this.moved = false;
	  this.captured = false;
    this.whitesTurn = true;
    this.previousMove = [0, 0, 0, 0];   //[prevTileX, prevTileY, currentTileX, currentTileY]    ; all 0 -> No Move yet
    this.castlingShortWhite = true;
    this.castlingLongWhite = true;
    this.castlingShortBlack = true;
    this.castlingLongBlack = true;
	  this.counter50MovesRule = 0;
	  this.whiteKingTile = [];
	  this.blackKingTile = [];
    this.repetition3Fold = [];
    this.promoted = false;
    this.promoSquare = [];

    include("./King.js");
    include("./Queen.js");
    include("./Rook.js");
    include("./Pawn.js");
    include("./Bishop.js");
    include("./Knight.js");

    this.rookW = new Image();
    this.rookW.src = './Images/rookWhite.png';
    this.queenW = new Image();
    this.queenW.src = './Images/queenWhite.png';
    this.knightW = new Image();
    this.knightW.src = './Images/knightWhite.png';
    this.bishopW = new Image();
    this.bishopW.src = './Images/bishopWhite.png';
    this.rookB = new Image();
    this.rookB.src = './Images/rookBlack.png';
    this.queenB = new Image();
    this.queenB.src = './Images/queenBlack.png';
    this.knightB = new Image();
    this.knightB.src = './Images/knightBlack.png';
    this.bishopB = new Image();
    this.bishopB.src = './Images/bishopBlack.png';

    this.setupBoard();

    //So that right on the first Move we can check if the Position has already been on the board
    this.pushPosition(this.repetition3Fold, this.Tiles);
  }


  //This happens when a Tile is clicked
  tileClicked(context, tileSize, tileX, tileY){
    //If promotion occured, change selectedTile to selected Piece and let the Piece go on last Rank
    if(this.promoted){
      this.promoted = false;
      this.promotionOccured(this.Tiles, this.whitesTurn, tileX, tileY, this.selectedPiece);
      tileX = this.promoSquare[0];
      tileY = this.promoSquare[1];

    }

    //No selected Piece yet
    if(this.selectedPiece.length == 0){
      this.possMoves = this.tryToSelectTile(tileX, tileY, tileSize);
    }

    //Already selected Piece
    else{
      //Auf grünen Punkt geklickt?
      for(let i = 0;i<this.possMoves.length;i++){
        if(tileX == this.possMoves[i][0] && tileY == this.possMoves[i][1]){

          //Promotion
          if(this.Tiles[this.selectedPiece[0]][this.selectedPiece[1]].constructor.name == "Pawn"){
            if(tileY == 0 || tileY == 7){
              this.promoted = true;
              this.drawPromote(context, tileSize, this.Tiles, this.whitesTurn, tileX, tileY);
              this.promoSquare = [tileX, tileY];
              return;
            }
          }

          //If a Piece was captured
          if(this.Tiles[tileX][tileY] != 0){
            this.captured = true;
          }

          //En passant(pawn moved diagonally on square where there is no Piece)
          if(this.Tiles[tileX][tileY] == 0 && this.Tiles[this.selectedPiece[0]][this.selectedPiece[1]].constructor.name=="Pawn" && tileX!=this.selectedPiece[0]){
            if(this.whitesTurn){
              this.Tiles[tileX][tileY+1] = 0;
            }
            else{
              this.Tiles[tileX][tileY-1] = 0;
            }
            this.captured = true;
          }

          //Castling (King moved 2 Squares); Disabling Castling if King moved; Changing Kings position
          if(this.Tiles[this.selectedPiece[0]][this.selectedPiece[1]].constructor.name=="King"){
            //King was moved -> Kings position changes
            if(this.whitesTurn){
              this.whiteKingTile = [tileX, tileY];
            }
            else{
              this.blackKingTile = [tileX, tileY];
            }

            //King was moved -> All castling disabled
            if(this.whitesTurn){
              this.castlingShortWhite = false;
              this.castlingLongWhite = false;
            }
            else{
              this.castlingShortBlack = false;
              this.castlingLongBlack = false;
            }
            //If King moved two squares, move Rook too
            if(Math.abs(tileX-this.selectedPiece[0])==2){
                    //Moving Rooks
              if(tileX>this.selectedPiece[0]){
                      this.Tiles[tileX-1][tileY] = this.Tiles[tileX+1][tileY];
                      this.Tiles[tileX+1][tileY] = 0;
                    }
                    if(tileX<this.selectedPiece[0]){
                      this.Tiles[tileX+1][tileY] = this.Tiles[tileX-2][tileY];
                      this.Tiles[tileX-2][tileY] = 0;
                    }
              }
          }
          //Disabling Long Castling if Rook moved
          if((this.selectedPiece[0]==0 && this.selectedPiece[1]==0)||(this.selectedPiece[0]==0 && this.selectedPiece[1]==7)){
            if(this.whitesTurn){
              this.castlingLongWhite = false;
            }
            else{
              this.castlingLongBlack = false;
            }
          }
          //Disabling Short Castling if Rook //If Pawn moved or Piece was captured: Reset counter, Reset 3-Fold-Repetition-Array
          if(this.Tiles[tileX][tileY].constructor.name == "Pawn" || this.captured){
            this.counter50MovesRule = 0;
            this.repetition3Fold = [];
          }
          if((this.selectedPiece[0]==7 && this.selectedPiece[1]==0)||(this.selectedPiece[0]==7 && this.selectedPiece[1]==7)){
            if(this.whitesTurn){
              this.castlingShortWhite = false;
            }
            else{
              this.castlingShortBlack = false;
            }
          }

          //Moving/Capturing
          this.Tiles[tileX][tileY] = this.Tiles[this.selectedPiece[0]][this.selectedPiece[1]];
          this.Tiles[this.selectedPiece[0]][this.selectedPiece[1]] = 0;


          ////////////////////////////////////////////////////////////////////////////////////////////////
          //If Pawn moved or Piece was captured: Reset counter, Reset 3-Fold-Repetition-Array
          if(this.Tiles[tileX][tileY].constructor.name == "Pawn" || this.captured){
            this.counter50MovesRule = 0;
            //Reset Array and add new Position
            this.repetition3Fold = [];
            this.pushPosition(this.repetition3Fold, this.Tiles);
          }
          //If no Piece was captured and no Pawn was moved: Increase Counter, check for 3-Fold-Repetition
          else{
            this.counter50MovesRule += 0.5;
            //Was this Position already reached and if so, more than two times?
            let alreadyIn = false;
            let allTheSame;
            for(let pastPos = 0;pastPos<this.repetition3Fold.length;pastPos++){
              allTheSame = true;
              for(let col = 0;col<8;col++){
                if(!allTheSame){break;}
                for(let row = 0;row<8;row++){
                  if(this.repetition3Fold[pastPos][0][col][row] != this.Tiles[col][row]){
                    allTheSame = false;
                    break;
                  }
                }
              }
              //If all Tiles are the same as in the already saved Position
              if(allTheSame){
                alreadyIn = true;
                this.repetition3Fold[pastPos][1]+=1;
                if(this.repetition3Fold[pastPos][1] > 2){
                  this.stalemate();
                }
                break;
              }
            }
            if(!alreadyIn){
              this.pushPosition(this.repetition3Fold, this.Tiles);
            }
          }


          //Resetting
          this.previousMove = [this.selectedPiece[0], this.selectedPiece[1], tileX, tileY];
          this.moved = true;
          this.possMoves = [];
          this.selectedPiece = [];
          this.whitesTurn = !this.whitesTurn;

          break;
        }
      }
      //If no move occured, was another Tile selected?
      if(!this.moved){
        //Different Piece selected
        this.possMoves = this.tryToSelectTile(tileX, tileY, tileSize);
      }
    }

    //Redrawing Canvas
    this.draw(context, tileSize);

    //Checking if Game is over
    if(this.moved){
      this.isGameOver(this.Tiles, this.whitesTurn, this.counter50MovesRule);
    }

    //resetting Variables
    this.moved = false;
	  this.captured = false;
    this.promoted = false;
  }

  //This Method checks if a possMove is truly possible due to the King standing in Check
  checkForChecks(currentPosition, movesToCheck, selectedPiece, squareToCheck, whitesTurn){
    let possiblePosition = [];
    let possMoves = [];
    let possible = true;

    //Going through every possible Endposition
    for(let i = 0;i<movesToCheck.length;i++){

      //possiblePosition = currentPosition, assignung values one by one or else Tiles gets changed
      possiblePosition = [];
      for(let col = 0;col<8;col++){
        possiblePosition.push([]);
        for(let row = 0;row<8;row++){
          possiblePosition[col].push(currentPosition[col][row]);
        }
      }

      possible = true;
      //////////////////////////////////////////////////////////////////////////////////
      //Now calculating the Position after the move to check was made

      //En passant(pawn moved diagonally on square where there is no Piece)
      if(possiblePosition[movesToCheck[i][0]][movesToCheck[i][1]] == 0 && possiblePosition[selectedPiece[0]][selectedPiece[1]].constructor.name=="Pawn" && movesToCheck[i][0]!=selectedPiece[0]){
        if(whitesTurn){
          possiblePosition[movesToCheck[i][0]][movesToCheck[i][1]+1] = 0;
        }
        else{
          possiblePosition[movesToCheck[i][0]][movesToCheck[i][1]-1] = 0;
        }
      }

      //Castling (King moved 2 Squares); Disabling Castling if King moved; Changing Kings position
      if(possiblePosition[selectedPiece[0]][selectedPiece[1]].constructor.name=="King"){
        //King was moved -> Kings position changes
        squareToCheck = [movesToCheck[i][0], movesToCheck[i][1]];

        //If King moved two squares, move Rook too
        if(Math.abs(movesToCheck[i][0]-selectedPiece[0])==2){
                //Moving Rooks
          if(movesToCheck[i][0]>selectedPiece[0]){
                  possiblePosition[movesToCheck[i][0]-1][movesToCheck[i][1]] = possiblePosition[movesToCheck[i][0]+1][movesToCheck[i][1]];
                  possiblePosition[movesToCheck[i][0]+1][movesToCheck[i][1]] = 0;
                }
                if(movesToCheck[i][0]<selectedPiece[0]){
                  possiblePosition[movesToCheck[i][0]+1][movesToCheck[i][1]] = possiblePosition[movesToCheck[i][0]-2][movesToCheck[i][1]];
                  possiblePosition[movesToCheck[i][0]-2][movesToCheck[i][1]] = 0;
                }

          }
      }
      //Moving/Capturing
      possiblePosition[movesToCheck[i][0]][movesToCheck[i][1]] = possiblePosition[selectedPiece[0]][selectedPiece[1]];
      possiblePosition[selectedPiece[0]][selectedPiece[1]] = 0;

      //////////////////////////////////////////////////////////////////////////////////

      //Now possiblePosition is the position after the move-to-check is made

      //Now check all different colored Pieces and their possMoves(without checking for Checks)
      for(let col = 0;col<8;col++){
        if(!possible){
          break;
        }
        for(let row = 0;row<8;row++){
          if(!possible){
            break;
          }
          if(possiblePosition[col][row] != 0 && possiblePosition[col][row].isWhite != whitesTurn){
            //En passant and castling wont be calculated, but isnt important anyway (cant capture King by those moves)
            possMoves = possiblePosition[col][row].pieceClicked(possiblePosition, col, row);
            //Can the Piece capture the King?
            for(let j = 0;j<possMoves.length;j++){
              if(possMoves[j][0] == squareToCheck[0] && possMoves[j][1] == squareToCheck[1]){
                possible = false;
                break;
              }
            }
          }
        }
      }
      if(!possible){
        movesToCheck.splice(i, 1);
        i-=1;
      }
    }
    return movesToCheck;
  }

  //Adding odd Moves
  addCastlingAndEnPassant(tileX, tileY, possMoves, selectedPiece){
      //If en passant possible -> adding one Move to possMoves
      if((Math.abs(this.previousMove[1]-this.previousMove[3])==2)&&(this.previousMove[0]==this.previousMove[2])&&(this.Tiles[this.previousMove[2]][this.previousMove[3]].constructor.name == "Pawn")){
        if(this.Tiles[selectedPiece[0]][selectedPiece[1]].constructor.name=="Pawn"){
          if(selectedPiece[1]==this.previousMove[3] && Math.abs(selectedPiece[0]-this.previousMove[2])==1){
            if(this.whitesTurn){
              possMoves.push([this.previousMove[2], this.previousMove[3]-1]);
            }
            else{
              possMoves.push([this.previousMove[2], this.previousMove[3]+1]);
            }

          }
        }
      }

    //If castling Possible -> adding to possMoves
      if(tileX==4){
        //Short
        this.tryToAddCastlingShort(possMoves, selectedPiece);
        //Long
        this.tryToAddCastlingLong(possMoves, selectedPiece);
      }
  }

  tryToSelectTile(tileX, tileY, tileSize){
      if(this.Tiles[tileX][tileY] != 0 && this.Tiles[tileX][tileY].isWhite == this.whitesTurn){
        this.possMoves = this.Tiles[tileX][tileY].pieceClicked(this.Tiles, tileX, tileY);
        this.selectedPiece = [tileX, tileY];
        this.addCastlingAndEnPassant(tileX, tileY, this.possMoves, this.selectedPiece);
        let kingTile;
        if(this.whitesTurn){
          kingTile = this.whiteKingTile;
        }
        else{
          kingTile = this.blackKingTile;
        }
        return this.checkForChecks(this.Tiles, this.possMoves, this.selectedPiece, kingTile, this.whitesTurn);
      }
      else{
        this.selectedPiece = [];
        return [];
      }
  }

  draw(context, tileSize){
    this.drawBoard(context, tileSize);
    this.drawPieces(context, tileSize);
    this.drawDots(context, tileSize);
  }

  //Draw the Board
  drawBoard(context, tileSize){
    //Chessboardtemplate
    context.fillStyle = this.lightColor;
    for(let i = 0;i<4;i++){
      for(let j = 0;j<4;j++){
        context.fillRect(tileSize*(1+j*2), tileSize*2*i, tileSize, tileSize);
      }
      for(let j = 0;j<4;j++){
        context.fillRect(tileSize*(2*i), tileSize*(1+j*2), tileSize, tileSize);
      }
    }

    context.fillStyle = this.darkColor;
    for(let i = 0;i<4;i++){
      for(let j = 0;j<4;j++){
        context.fillRect(tileSize*j*2, tileSize*2*i, tileSize, tileSize);
      }
      for(let j = 0;j<4;j++){
        context.fillRect(tileSize*(2*i+1), tileSize*(1+j*2), tileSize, tileSize);
      }
    }
  }

  //Draw all Pieces
  drawPieces(context, tileSize){
    //Font and Size
    var numStr = tileSize.toString(10);
    context.font = numStr + "px Verdana";

    //Drawing all Pieces
    for(let i = 0;i<8;i++){
      for(let j = 0;j<8;j++){
        if(this.Tiles[i][j] != 0){
          this.Tiles[i][j].draw(context, tileSize, i, j);
        }
      }
    }
  }

  drawDots(context, tileSize){
	  context.fillStyle = "green";
	  for(let i=0;i<this.possMoves.length;i++){
	     context.fillRect(tileSize*(this.possMoves[i][0] + 0.4), tileSize*(this.possMoves[i][1] + 0.4), tileSize/5, tileSize/5);
	  }
  }

  //Initialize all Pieces
  setupBoard(){
    //White Pieces
    this.Tiles[0][7] = new Rook(true);
    this.Tiles[1][7] = new Knight(true);
    this.Tiles[2][7] = new Bishop(true);
    this.Tiles[3][7] = new Queen(true);
    this.Tiles[5][7] = new Bishop(true);
    this.Tiles[6][7] = new Knight(true);
    this.Tiles[7][7] = new Rook(true);
    this.Tiles[4][7] = new King(true);
    this.whiteKingTile = [4, 7];

    //Black Pieces
    this.Tiles[0][0] = new Rook(false);
    this.Tiles[1][0] = new Knight(false);
    this.Tiles[2][0] = new Bishop(false);
    this.Tiles[3][0] = new Queen(false);
    this.Tiles[5][0] = new Bishop(false);
    this.Tiles[6][0] = new Knight(false);
    this.Tiles[7][0] = new Rook(false);
    this.Tiles[4][0] = new King(false);
    this.blackKingTile = [4,0];

    //Pawns
    for(let i = 0;i<8;i++){
      this.Tiles[i][1] = new Pawn(false);
      this.Tiles[i][6] = new Pawn(true);
    }
  }

  tryToAddCastlingShort(possMoves, selectedPiece){
    if(this.Tiles[selectedPiece[0]][selectedPiece[1]].constructor.name == "King" && ((this.castlingShortWhite && this.whitesTurn)||(this.castlingShortBlack && (!this.whitesTurn)))){
      if(this.Tiles[selectedPiece[0]+1][selectedPiece[1]] == 0 && this.Tiles[selectedPiece[0]+2][selectedPiece[1]] == 0){
        //If King goes through Check -> No castling allowed
        let castlingShortS1 = this.checkForChecks(this.Tiles, [[selectedPiece[0]+1, selectedPiece[1]]], selectedPiece, [selectedPiece[0], selectedPiece[1]], this.whitesTurn);
        let castlingShortS2 = this.checkForChecks(this.Tiles, [[selectedPiece[0], selectedPiece[1]]], selectedPiece, [selectedPiece[0], selectedPiece[1]], this.whitesTurn);
        if(castlingShortS1.length != 0 && castlingShortS2.length != 0){
          possMoves.push([selectedPiece[0]+2, selectedPiece[1]]);
        }
      }
    }
  }
  tryToAddCastlingLong(possMoves, selectedPiece){
    if(this.Tiles[selectedPiece[0]][selectedPiece[1]].constructor.name == "King" && ((this.castlingLongWhite && this.whitesTurn)||(this.castlingLongBlack && (!this.whitesTurn)))){
      if(this.Tiles[selectedPiece[0]-3][selectedPiece[1]] == 0 && this.Tiles[selectedPiece[0]-2][selectedPiece[1]] == 0 && this.Tiles[selectedPiece[0]-1][selectedPiece[1]] == 0){
        //If King goes through Check -> No castling allowed
        let castlingShortS1 = this.checkForChecks(this.Tiles, [[selectedPiece[0]-1, selectedPiece[1]]], selectedPiece, [selectedPiece[0], selectedPiece[1]], this.whitesTurn);
        let castlingShortS2 = this.checkForChecks(this.Tiles, [[selectedPiece[0], selectedPiece[1]]], selectedPiece, [selectedPiece[0], selectedPiece[1]], this.whitesTurn);
        if(castlingShortS1.length != 0 && castlingShortS2.length != 0){
          possMoves.push([selectedPiece[0]-2, selectedPiece[1]]);
        }
      }
    }
  }
Position
  //Method for pushing the Position to the repetition-Array
  pushPosition(repetition3Fold, Position){
    repetition3Fold.push( [[[0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0],
                            [0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0],
                            [0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0]                    ], 1]);

    for(let col=0;col<8;col++){
      for(let row=0;row<8;row++){
        repetition3Fold[repetition3Fold.length-1][0][col][row] = Position[col][row];
      }
    }
  }

  //Promotion
  drawPromote(context, tileSize, Position, whitesTurn, tileX, tileY){
    context.fillStyle = "#404040";
    context.fillRect(0, 0, tileSize*8, tileSize*8);
    if(whitesTurn){
      context.drawImage(this.rookW, 2*tileSize, tileSize, tileSize, tileSize);
      context.drawImage(this.bishopW, 2*tileSize, 3*tileSize, tileSize, tileSize);
      context.drawImage(this.queenW, 5*tileSize, tileSize, tileSize, tileSize);
      context.drawImage(this.knightW, 5*tileSize, 3*tileSize, tileSize, tileSize);
    }
    else{
      context.drawImage(this.rookB, 2*tileSize, 4*tileSize, tileSize, tileSize);
      context.drawImage(this.bishopB, 2*tileSize, 6*tileSize, tileSize, tileSize);
      context.drawImage(this.queenB, 5*tileSize, 4*tileSize, tileSize, tileSize);
      context.drawImage(this.knightB, 5*tileSize, 6*tileSize, tileSize, tileSize);
    }
  }

  //Change the Piece to the selected Piece and continue the normal TileClicked Method
  promotionOccured(Position, whitesTurn, tileX, tileY, selectedPiece){
    if(whitesTurn){
      if(tileX==2 && tileY==1){
        Position[selectedPiece[0]][selectedPiece[1]] = new Rook(whitesTurn);
      }
      else if(tileX==5 && tileY==1){
        Position[selectedPiece[0]][selectedPiece[1]] = new Queen(whitesTurn);
      }
      else if(tileX==2 && tileY==3){
        Position[selectedPiece[0]][selectedPiece[1]] = new Bishop(whitesTurn);
      }
      else if(tileX==5 && tileY==3){
        Position[selectedPiece[0]][selectedPiece[1]] = new Knight(whitesTurn);
      }
    }
    else{
      if(tileX==2 && tileY==4){
        Position[selectedPiece[0]][selectedPiece[1]] = new Rook(whitesTurn);
      }
      else if(tileX==5 && tileY==4){
        Position[selectedPiece[0]][selectedPiece[1]] = new Queen(whitesTurn);
      }
      else if(tileX==2 && tileY==6){
        Position[selectedPiece[0]][selectedPiece[1]] = new Bishop(whitesTurn);
      }
      else if(tileX==5 && tileY==6){
        Position[selectedPiece[0]][selectedPiece[1]] = new Knight(whitesTurn);
      }
    }
  }

  //Checking if Game is over
  isGameOver(Position, whitesTurn, counter50MovesRule){
    //Checking if there is any Piece that can move
    let over = true;
    let kingInCheck = false;
    let possibleMoves = [];
    let selPiece = [];
    let kingTile;
    if(whitesTurn){
      kingTile = this.whiteKingTile;
    }
    else{
      kingTile = this.blackKingTile;
    }


    for(let col = 0;col<8;col++){
      if(!over){break;}
      for(let row = 0;row<8;row++){

        if(Position[col][row] != 0){
          possibleMoves = Position[col][row].pieceClicked(Position, col, row);

          //Checking if move possible
          if(Position[col][row].isWhite == whitesTurn){
            selPiece = [col, row];
            this.addCastlingAndEnPassant(col, row, possibleMoves, selPiece);
            possibleMoves = this.checkForChecks(Position, possibleMoves, selPiece, kingTile, whitesTurn);

            if(possibleMoves.length != 0){
              over = false;
              break;
            }
          }
          //Checking if King in Check
          else{
            if(!kingInCheck){
              for(let i=0;i<possibleMoves.length;i++){
                if(possibleMoves[i][0] == kingTile[0] && possibleMoves[i][1] == kingTile[1]){
                  kingInCheck = true;
                  break;
                }
              }
            }
          }
        }

      }
    }

    if(over&&kingInCheck){
      this.checkmate();
    }
    else if ((over&&(!kingInCheck))||counter50MovesRule>=50){
      this.stalemate();
    }
  }

  checkmate(){
    alert("checkmate");
  }

  stalemate(){
    alert("stalemate");
  }

//Ende der Klasse
}


//Function to include Files
function include(file){
  file = file.toString();
  var script = document.createElement("script");
  script.scr = file;
  script.type = "text/javascript";
  script.defer = true;
  document.body.appendChild(script);
}
