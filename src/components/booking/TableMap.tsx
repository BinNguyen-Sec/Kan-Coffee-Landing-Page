'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Table } from '@/types/table'
import { FLOOR1_INDOOR, FLOOR1_OUTDOOR, FLOOR2_INDOOR } from '@/constants/tables'

interface TableMapProps {
  tables: Table[]
  onTableClick: (table: Table) => void
}

const CELL = 56
const ISO_X = CELL
const ISO_Y = CELL * 0.5

function toIso(x: number, y: number) {
  return {
    px: (x - y) * ISO_X,
    py: (x + y) * ISO_Y,
  }
}

function getTableColor(status: string, isBookable: boolean) {
  if (!isBookable) return { fill: '#E8F5D0', stroke: '#A0C060', text: '#80AE4A' }
  switch (status) {
    case 'available': return { fill: '#D4EDBA', stroke: '#4D8E00', text: '#315D02' }
    case 'pending':   return { fill: '#FFF3CD', stroke: '#FFC107', text: '#856404' }
    case 'booked':    return { fill: '#FFD6D6', stroke: '#DC3545', text: '#842029' }
    default:          return { fill: '#D4EDBA', stroke: '#4D8E00', text: '#315D02' }
  }
}

interface IsoTableProps {
  name: string
  x: number
  y: number
  width?: number
  status: string
  isBookable: boolean
  onClick?: () => void
}

function IsoTable({ name, x, y, width = 1, status, isBookable, onClick }: IsoTableProps) {
  const [hovered, setHovered] = useState(false)
  const { px, py } = toIso(x, y)
  const colors = getTableColor(status, isBookable)
  const w = width * CELL * 0.8
  const h = CELL * 0.45
  const depth = 10
  const clickable = isBookable && status === 'available'

  return (
    <g
      transform={`translate(${px}, ${py})`}
      onClick={clickable ? onClick : undefined}
      onMouseEnter={() => clickable && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ cursor: clickable ? 'pointer' : 'default' }}
    >
      {/* Glow effect */}
      {hovered && (
        <ellipse
          cx={w / 2}
          cy={h / 2 + depth}
          rx={w * 0.6}
          ry={h * 0.5}
          fill={colors.stroke}
          opacity={0.25}
          filter="url(#glow)"
        />
      )}

      {/* Table top face */}
      <motion.rect
        x={0}
        y={0}
        width={w}
        height={h}
        rx={4}
        fill={hovered ? colors.stroke : colors.fill}
        stroke={colors.stroke}
        strokeWidth={hovered ? 2 : 1}
        animate={hovered ? { scale: 1.05 } : { scale: 1 }}
        style={{ transformOrigin: `${w / 2}px ${h / 2}px` }}
        transition={{ duration: 0.15 }}
      />

      {/* Table depth (isometric side) */}
      <rect
        x={0}
        y={h}
        width={w}
        height={depth}
        rx={2}
        fill={colors.stroke}
        opacity={0.4}
      />

      {/* Table label */}
      <text
        x={w / 2}
        y={h / 2 + 4}
        textAnchor="middle"
        fontSize={9}
        fontWeight="600"
        fill={hovered ? 'white' : colors.text}
        style={{ userSelect: 'none', pointerEvents: 'none' }}
      >
        {name}
      </text>

      {/* Walk-in badge */}
      {!isBookable && (
        <text
          x={w / 2}
          y={h + depth + 10}
          textAnchor="middle"
          fontSize={7}
          fill="#80AE4A"
          style={{ userSelect: 'none', pointerEvents: 'none' }}
        >
          walk-in
        </text>
      )}
    </g>
  )
}

export default function TableMap({ tables, onTableClick }: TableMapProps) {
  const [activeFloor, setActiveFloor] = useState<1 | 2>(1)

  const getTableStatus = (name: string) => {
    const t = tables.find((t) => t.name === name)
    return t?.status ?? 'available'
  }

  const getTableObj = (name: string) => tables.find((t) => t.name === name)

  const floor1Tables = [...FLOOR1_INDOOR, ...FLOOR1_OUTDOOR]
  const floor2Tables = FLOOR2_INDOOR

  const activeTables = activeFloor === 1 ? floor1Tables : floor2Tables

  // Calculate SVG bounds
  const allPx = activeTables.map((t) => toIso(t.x, t.y).px)
  const allPy = activeTables.map((t) => toIso(t.x, t.y).py)
  const minX = Math.min(...allPx) - CELL
  const minY = Math.min(...allPy) - CELL * 0.5
  const maxX = Math.max(...allPx) + CELL * 2.5
  const maxY = Math.max(...allPy) + CELL * 1.5
  const svgW = maxX - minX
  const svgH = maxY - minY

  return (
    <div className="w-full">
      {/* Floor toggle */}
      <div className="flex gap-2 mb-6 justify-center">
        {([1, 2] as const).map((floor) => (
          <button
            key={floor}
            onClick={() => setActiveFloor(floor)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              activeFloor === floor
                ? 'bg-kan-primary text-white shadow-md'
                : 'bg-kan-light/30 text-kan-dark border border-kan-light hover:border-kan-primary'
            }`}
          >
            Floor {floor}
          </button>
        ))}
      </div>

      {/* SVG Map */}
      <div className="overflow-x-auto rounded-2xl border border-kan-light bg-white p-4">
        <AnimatePresence mode="wait">
          <motion.svg
            key={activeFloor}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            width={svgW}
            height={svgH}
            viewBox={`${minX} ${minY} ${svgW} ${svgH}`}
            className="mx-auto"
          >
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {activeTables.map((pos) => {
              const tableObj = getTableObj(pos.name)
              return (
                <IsoTable
                  key={pos.name}
                  name={pos.name}
                  x={pos.x}
                  y={pos.y}
                  width={pos.width}
                  status={getTableStatus(pos.name)}
                  isBookable={pos.isBookable}
                  onClick={() => tableObj && onTableClick(tableObj)}
                />
              )
            })}
          </motion.svg>
        </AnimatePresence>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 justify-center mt-4 text-xs text-kan-dark/60">
        {[
          { color: '#D4EDBA', stroke: '#4D8E00', label: 'Available' },
          { color: '#FFF3CD', stroke: '#FFC107', label: 'Pending' },
          { color: '#FFD6D6', stroke: '#DC3545', label: 'Booked' },
          { color: '#E8F5D0', stroke: '#A0C060', label: 'Walk-in only' },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-1.5">
            <div
              className="w-3 h-3 rounded-sm border"
              style={{ backgroundColor: item.color, borderColor: item.stroke }}
            />
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}