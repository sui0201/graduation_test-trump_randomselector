"use client";
import { useState } from "react";

interface Card {
  card_number: number;
  mark: string;
  color: string;
}

const marks = ["spade", "diamond", "clover", "heart"] as const;

export default function Board() {
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);

  const decks: Card[] = [];
  marks.forEach((mark) => {
    for (let i = 1; i <= 13; i++) {
      decks.push({
        card_number: i,
        mark,
        color: mark === "spade" || mark === "clover" ? "black" : "red",
      });
    }
  });

  const shuffledDeck = [...decks].sort(() => Math.random() - 0.5);

  const handleCardClick = (card: Card) => {
    setSelectedCard(card);
  };

  const handleBack = () => {
    setSelectedCard(null);
  };

  return (
    <div className="relative flex flex-col justify-center items-center min-h-screen bg-black overflow-hidden">
      <div className="title text-4xl font-bold mb-8">カード表示</div>

      {!selectedCard ? (
        <div className="grid grid-cols-13 gap-2 justify-center">
          {shuffledDeck.map((card, index) => (
            <CardComponent
              key={index}
              card_number={card.card_number}
              mark={card.mark}
              color={card.color}
              onClick={handleCardClick}
            />
          ))}
        </div>
      ) : (
        <div className="absolute inset-0 flex flex-col justify-center items-center bg-black">
          <CardComponent
            card_number={selectedCard.card_number}
            mark={selectedCard.mark}
            color={selectedCard.color}
            large
            flipped
          />
          <button
            onClick={handleBack}
            className="mt-8 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            戻る
          </button>
        </div>
      )}
    </div>
  );
}

function CardComponent({card_number, mark, color, onClick, large, flipped,}: Card & {
  onClick?: (card: Card) => void;
  large?: boolean;
  flipped?: boolean;
}) {
  const [isFlipped, setIsFlipped] = useState(flipped ?? false);

  const handleFlip = () => {
    if (!isFlipped) {
      setIsFlipped(true);
      onClick?.({ card_number, mark, color });
    }
  };

  return (
    <button
      onClick={handleFlip}
      className={`rounded-lg flex items-center justify-center font-bold border transition-all duration-500 transform
        ${isFlipped ? (color === "red" ? "text-red-500 bg-white" : "text-black bg-white") : "bg-gray-500"}
        ${large ? "w-64 h-80 text-5xl" : "w-24 h-36 text-sm hover:scale-105"}
      `}
    >
      {isFlipped ? `${mark}${card_number}` : ""}
    </button>
  );
}
