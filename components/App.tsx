"use client";
import { useMemo, useRef, useState } from "react";

type Mark = "♤" | "◆" | "♧" | "♥";

interface Card {
  id: string;
  card_number: number;
  mark: Mark;
  color: "red" | "black";
}

interface CardComponent {
  card: Card;
  isflip: boolean;
  isMatched: boolean;
  onClick: (index: number) => void;
  index: number;
  large?: boolean;
}

function CardComponent({
  card,
  isflip,
  isMatched,
  onClick,
  index,
  large = false,
}: CardComponent) {
  const cardimg =
    "https://previews.123rf.com/images/bobyramone/bobyramone1104/bobyramone110400018/9317969-playing-card-back-side-62x90-mm.jpg";

  const handleClick = () => {
    if (!isflip && !isMatched) onClick(index);
  };

  return (
    <button
      aria-label={isflip ? `${card.mark} ${card.card_number}` : "card back"}
      onClick={handleClick}
      className={`relative perspective-1000 focus:outline-none
        ${large ? "w-48 h-64 sm:w-56 sm:h-72" : "w-16 h-24 sm:w-20 sm:h-28 md:w-24 md:h-36"}
      `}
    >
      <div className={`duration-500 ease-in-out transform transition-transform relative w-full h-full rounded-lg
          ${isflip || isMatched ? "rotate-y-180" : ""}
          ${isMatched ? "ring-4 ring-green-300" : ""}
        `}
        style={{ transformStyle: "preserve-3d" }}
      >
        <div className={`absolute inset-0 backface-hidden rounded-lg flex flex-col items-center justify-center font-bold border
            ${card.color === "red" ? "text-red-600" : "text-black"} bg-white text-xs sm:text-sm md:text-base
          `}
          style={{ transform: "rotateY(180deg)" }}
        >
          <div className="text-lg sm:text-xl md:text-2xl">{card.mark}</div>
          <div className="text-2xl sm:text-3xl md:text-4xl">{card.card_number}</div>
        </div>

        <div className="absolute inset-0 backface-hidden rounded-lg bg-cover bg-center"
          style={{
            backgroundImage: `url(${cardimg})`,
            transform: "rotateY(0deg)",
          }}
        />
      </div>
    </button>
  );
}

export default function Board() {

  const marks: Mark[] = ["♤", "◆", "♧", "♥"];

  const front = useMemo(() => {
    const front: Card[] = [];
    marks.forEach((mark) => {
      for (let i = 1; i <= 13; i++) {
        front.push({
          id: `${mark}-${i}`,
          card_number: i,
          mark,
          color: mark === "♤" || mark === "♧" ? "black" : "red",
        });
      }
    });
    return front;
  }, []);

  const pair = 12;

  const Shuffle = (): Card[] => {

    const shufflefront = front.sort(() => Math.random() - 0.5);
    const selected = shufflefront.slice(0, pair);
    const double = [...selected, ...selected];

    return double.sort(() => Math.random() - 0.5);
  };

  const [deck, setdeck] = useState<Card[]>(() => Shuffle());
  const [flip, setflip] = useState<number[]>([]);
  const [match, setmatch] = useState<Set<string>>(new Set());
  const [moves, setmoves] = useState<number>(0);
  const [started, setStarted] = useState<boolean>(false);
  const lockRef = useRef<boolean>(false);

  const handleCardClick = (index: number) => {
    if (lockRef.current) return;
    if (flip.includes(index)) return;
    const clicked = deck[index];
    if (match.has(clicked.id)) return;

    if (!started) setStarted(true);

    if (flip.length === 0) {
      setflip([index]);
      return;
    }

    if (flip.length === 1) {
      const firstIndex = flip[0];
      const secondIndex = index;

      setflip([firstIndex, secondIndex]);
      setmoves((m) => m + 1);
      lockRef.current = true;

      const firstCard = deck[firstIndex];
      const secondCard = deck[secondIndex];

      if (firstCard.id === secondCard.id) {
        setTimeout(() => {
          setmatch((prev) => {
            const next = new Set(prev);
            next.add(firstCard.id);
            return next;
          });
          setflip([]);
          lockRef.current = false;
        }, 600);
      } else {
        setTimeout(() => {
          setflip([]);
          lockRef.current = false;
        }, 900);
      }
    }
  };

  const restart = () => {
    setdeck(Shuffle());
    setflip([]);
    setmatch(new Set());
    setmoves(0);
    setStarted(false);
    lockRef.current = false;
  };

  const gridClasses = `grid gap-3 justify-center grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-12 max-w-fullS`;

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-800 text-white p-4">
      <header className="w-full max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">神経衰弱</h1>
        <div className="flex items-center gap-3">
          <div className="text-sm sm:text-base">
            <div>手数: {moves}</div>
            <div>マッチ数: {match.size}/{pair}</div>
          </div>
          <div className="flex gap-2">
            <button onClick={restart} className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded-md text-sm">
              リスタート
            </button>
          </div>
        </div>
      </header>

      <main className="w-full max-w-6xl">
        <div className={gridClasses}>
          {deck.map((card, idx) => {
            const isflip = flip.includes(idx);
            const isMatched = match.has(card.id);
            return (
              <CardComponent
                key={`${card.id}-${idx}`}
                card={card}
                index={idx}
                isflip={isflip || isMatched}
                isMatched={isMatched}
                onClick={handleCardClick}
                large={false}
              />
            );
          })}
        </div>
      </main>
    </div>
  );
}


