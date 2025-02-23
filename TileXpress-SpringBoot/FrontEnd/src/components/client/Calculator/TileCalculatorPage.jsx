import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import { TiArrowBackOutline } from 'react-icons/ti';

const TileCalculatorPage = () => {
  const navigate = useNavigate();
  const [tileLength, setTileLength] = useState('');
  const [tileWidth, setTileWidth] = useState('');
  const [tileUnit, setTileUnit] = useState('cm');
  const [area, setArea] = useState('');
  const [gapSize, setGapSize] = useState('');
  const [gapUnit, setGapUnit] = useState('cm');
  const [boxSize, setBoxSize] = useState('');
  const [result, setResult] = useState(null);

  const handleBack = () => {
    navigate(-1);
  };

  const convertToFeet = (value, unit) => {
    switch (unit) {
      case 'cm': return value / 30.48;
      case 'inches': return value / 12;
      case 'meter': return value * 3.28084;
      case 'feet': return value;
      default: return value;
    }
  };

  const calculateTiles = () => {
    setResult(null);
    
    if (!tileLength || !tileWidth || !area || !gapSize || !boxSize || isNaN(tileLength) || isNaN(tileWidth) || isNaN(area) || isNaN(gapSize) || isNaN(boxSize) || area <= 0 || boxSize <= 0) {
      toast.error('Please enter valid inputs');
      return;
    }
    
    const lengthInFeet = convertToFeet(Number(tileLength), tileUnit);
    const widthInFeet = convertToFeet(Number(tileWidth), tileUnit);
    const gapInFeet = convertToFeet(Number(gapSize), gapUnit);
    const tileSizeSquareFeet = ((lengthInFeet + gapInFeet) * (widthInFeet + gapInFeet));
    const tilesNeeded = Math.ceil(Number(area) / tileSizeSquareFeet);
    const boxesNeeded = Math.ceil(tilesNeeded / Number(boxSize));

    setResult({ tilesNeeded, boxesNeeded });
  };

  const handleReset = () => {
    setTileLength('');
    setTileWidth('');
    setTileUnit('cm');
    setArea('');
    setGapSize('');
    setGapUnit('cm');
    setBoxSize('');
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="lg:w-4/5 mx-auto mb-4 flex items-center">
        <TiArrowBackOutline className="text-indigo-500" />
        <button onClick={handleBack} className="bg-indigo-50 text-indigo-500 px-4 py-1 ml-1 rounded border">Back</button>
      </div>
      <Toaster position="top-center" reverseOrder={false} />

      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl text-red-500 font-bold mb-6 text-center">Tile Calculator</h2>
        
        <div className="mb-4">
          <label className="block text-gray-700">Tile Size</label>
          <div className="flex space-x-2">
            <input type="number" value={tileLength} onChange={(e) => setTileLength(e.target.value)} placeholder="Length" className="w-full px-3 py-2 border rounded-md" />
            <input type="number" value={tileWidth} onChange={(e) => setTileWidth(e.target.value)} placeholder="Width" className="w-full px-3 py-2 border rounded-md" />
            <select value={tileUnit} onChange={(e) => setTileUnit(e.target.value)} className="px-2 py-2 border rounded-md">
              <option>cm</option><option>inches</option><option>meter</option><option>feet</option>
            </select>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Area to Cover (sq ft)</label>
          <input type="number" value={area} onChange={(e) => setArea(e.target.value)} className="w-full px-3 py-2 border rounded-md" />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Gap Size</label>
          <div className="flex space-x-2">
            <input type="number" value={gapSize} onChange={(e) => setGapSize(e.target.value)} className="w-full px-3 py-2 border rounded-md" />
            <select value={gapUnit} onChange={(e) => setGapUnit(e.target.value)} className="px-2 py-2 border rounded-md">
              <option>cm</option><option>inches</option><option>meter</option><option>feet</option>
            </select>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Tiles Per Box</label>
          <input type="number" value={boxSize} onChange={(e) => setBoxSize(e.target.value)} className="w-full px-3 py-2 border rounded-md" />
        </div>

        <div className="flex space-x-4 mb-6">
          <button onClick={calculateTiles} className="flex-1 bg-green-500 text-white py-2 rounded-md">Calculate</button>
          <button onClick={handleReset} className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-md">Reset</button>
        </div>

        {result && (
          <div className="mt-6 text-center">
            <p className="text-lg text-gray-700 font-semibold">Tiles Needed: <span className="text-red-500">{result.tilesNeeded}</span></p>
            <p className="text-lg text-gray-700 font-semibold">Boxes Needed: <span className="text-red-500">{result.boxesNeeded}</span></p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TileCalculatorPage;
