import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { Search, Book, Shuffle } from 'lucide-react';

const HyakuninIsshu = () => {
  const [poems, setPoems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentMode, setCurrentMode] = useState('list');
  const [currentPoem, setCurrentPoem] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // この下にコードを追加していきます
  // 詳細表示コンポーネント
const PoemDetail = ({ poem }) => (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-6">歌番号: {poem.歌順}</h2>
        <div className="space-y-6">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-2">漢字</div>
            <div className="text-xl">{getFullPoemText(poem)}</div>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-2">かな</div>
            <div className="text-xl">{getFullPoemText(poem.kana)}</div>
          </div>
        </div>
      </div>
  
      <div className="space-y-4">
        <div><span className="font-bold">作者:</span> {poem.作者}</div>
        <div><span className="font-bold">出典:</span> {poem.出典}</div>
        <div><span className="font-bold">主題:</span> {poem.主題}</div>
        <div className="mt-6">
          <div className="font-bold mb-2">解釈:</div>
          <div className="space-y-2">
            <div className="bg-gray-50 p-4 rounded">
              <div className="font-medium">上の句</div>
              <div>{poem.上の句の解釈}</div>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <div className="font-medium">下の句</div>
              <div>{poem.下の句の解釈}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const filteredPoems = poems.filter(poem => {
    const searchLower = searchTerm.toLowerCase();
    return (
      (poem.作者?.includes(searchTerm) || false) ||
      (poem.上の句?.includes(searchTerm) || false) ||
      (poem.下の句?.includes(searchTerm) || false) ||
      (getFullPoemText(poem).includes(searchTerm) || false)
    );
  });

  if (loading) {
    {/* クイズモード */}
{currentMode === 'quiz' && currentPoem && (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">歌番号: {currentPoem.歌順}</h2>
        <button
          onClick={getRandomPoem}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          <Shuffle className="w-4 h-4" />
          次の歌
        </button>
      </div>
  
      <div className="text-xl mb-4">
        <div className="mb-2">
          <div className="font-bold mb-2">上の句:</div>
          <div className="p-4 bg-gray-100 rounded">
            {currentPoem.上の句}{currentPoem[''] || ''}{currentPoem._1 || ''}
          </div>
        </div>
        
        <div>
          <div className="font-bold mb-2">下の句を選んでください:</div>
          <div className="grid grid-cols-2 gap-4">
            {currentPoem.options.map((option, index) => (
              <button
                key={index}
                onClick={() => setShowAnswer(true)}
                className={`p-4 rounded text-left ${
                  showAnswer
                    ? option.correct
                      ? 'bg-green-100 border-2 border-green-500'
                      : 'bg-gray-100'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {option.text}
                {showAnswer && option.correct && (
                  <div className="text-green-600 text-sm mt-2">
                    ← 正解
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
  
      {showAnswer && (
        <div className="mt-6">
          <div className="font-bold mb-2">解説:</div>
          <div className="space-y-2">
            <div className="bg-gray-50 p-4 rounded">
              <div className="font-medium">上の句</div>
              <div>{currentPoem.上の句の解釈}</div>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <div className="font-medium">下の句</div>
              <div>{currentPoem.下の句の解釈}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )}
  
  {/* 一覧表示モード */}
  {currentMode === 'list' && (
    <div className="space-y-4">
      {filteredPoems.map((poem) => (
        <div key={poem.歌順} className="bg-white p-4 rounded-lg shadow">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-sm text-gray-500 mb-1">歌番号: {poem.歌順}</div>
              <div className="text-lg mb-2">{getFullPoemText(poem)}</div>
              <div className="text-sm">
                <span className="font-medium">作者:</span> {poem.作者}
              </div>
            </div>
            <button
              onClick={() => {
                setCurrentPoem(poem);
                setCurrentMode('detail');
              }}
              className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
            >
              <Book className="w-4 h-4" />
              詳細
            </button>
          </div>
        </div>
      ))}
    </div>
  )}
  
  {/* 詳細表示モード */}
  {currentMode === 'detail' && currentPoem && (
    <PoemDetail poem={currentPoem} />
  )}

    return (
        <div className="max-w-4xl mx-auto p-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-4 text-gray-900">百人一首学習アプリ</h1>
            
            {/* タブナビゲーション */}
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8" aria-label="Tabs">
                <button
                  onClick={() => setCurrentMode('list')}
                  className={`py-4 px-1 relative ${
                    currentMode === 'list'
                      ? 'text-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <span className="font-medium">一覧</span>
                  {currentMode === 'list' && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></span>
                  )}
                </button>
                <button
                  onClick={() => {
                    setCurrentMode('quiz');
                    getRandomPoem();
                  }}
                  className={`py-4 px-1 relative ${
                    currentMode === 'quiz'
                      ? 'text-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <span className="font-medium">学習</span>
                  {currentMode === 'quiz' && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></span>
                  )}
                </button>
              </nav>
            </div>
      
            {/* 検索バー */}
            {currentMode === 'list' && (
              <div className="flex items-center gap-2 mb-4 mt-4">
                <Search className="w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  placeholder="歌や作者を検索..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
            )}
          </div>
      
          {/* これ以降のUIコンポーネントは次のステップで実装します */}
        </div>
      );
};

export default HyakuninIsshu;

// 和歌のテキストを取得する関数
const getFullPoemText = (poem) => {
    if (!poem) return '';
    return `${poem.上の句 || ''}${poem[''] || ''}${poem._1 || ''} ${poem.下の句 || ''}${poem._2 || ''}`;
  };
  
  // ランダムな和歌を選択する関数
  const getRandomPoem = () => {
    const randomIndex = Math.floor(Math.random() * poems.length);
    const selected = poems[randomIndex];
    
    const otherOptions = poems
      .filter(p => p.歌順 !== selected.歌順)
      .sort(() => Math.random() - 0.5)
      .slice(0, 5)
      .map(p => ({
        text: getFullPoemText(p.kana).split(' ')[1],
        id: p.歌順
      }));
    
    const correctOption = {
      text: getFullPoemText(selected.kana).split(' ')[1],
      id: selected.歌順,
      correct: true
    };
    
    const options = [...otherOptions, correctOption].sort(() => Math.random() - 0.5);
    setCurrentPoem({...selected, options});
    setShowAnswer(false);
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await window.fs.readFile('100issyu.xls');
        const workbook = XLSX.read(response, {
          cellStyles: true,
          cellFormulas: true,
          cellDates: true,
          cellNF: true,
          sheetStubs: true
        });
        
        // 漢字のデータを読み込み
        const kanjiSheet = workbook.Sheets[workbook.SheetNames[0]];
        const kanjiData = XLSX.utils.sheet_to_json(kanjiSheet)
          .filter(poem => poem.歌順 <= 100);
          
        // かなのデータを読み込み
        const kanaSheet = workbook.Sheets['歌順かな'];
        const kanaData = XLSX.utils.sheet_to_json(kanaSheet)
          .filter(poem => poem.歌順 <= 100);
        
        // データを結合
        const combinedData = kanjiData.map((poem, index) => ({
          ...poem,
          kana: kanaData[index]
        }));
        
        setPoems(combinedData);
        setLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        setLoading(false);
      }
    };
    loadData();
  }, []);