// src/main/protocols/mediaProtocolHandler.js
import { protocol } from 'electron'
import { existsSync, statSync, createReadStream } from 'fs'
import { extname } from 'path'
import { ipcMainHandle } from '../util.js'
import { Readable } from 'stream'

function getMimeType(filePath: string) {
    const ext = extname(filePath).toLowerCase()
    const mimeTypes = {
      '.mp4': 'video/mp4',
      '.webm': 'video/webm',
      '.ogg': 'video/ogg',
      '.mkv': 'video/x-matroska'
      // Add more as needed
    }

    if (ext in mimeTypes) {
      return mimeTypes[ext as keyof typeof mimeTypes]
    } else {
      return 'video/mp4'
    }
  }
  
  // Helper function to convert Node stream to Web stream
  function nodeStreamToWebStream(nodeStream: Readable) {
    return new ReadableStream({
      start(controller) {
        nodeStream.on('data', (chunk) => {
          controller.enqueue(chunk)
        })
        nodeStream.on('end', () => {
          controller.close()
        })
        nodeStream.on('error', (err) => {
          controller.error(err)
        })
      },
      cancel() {
        nodeStream.destroy()
      }
    })
  }
  
  // Helper function to parse Range header
  function parseRange(rangeHeader: string, fileSize: number) {
    const matches = /bytes=(\d+)-(\d*)/.exec(rangeHeader)
    if (!matches) return [0, fileSize - 1] // Default to sending the entire file
  
    const start = parseInt(matches[1], 10)
    const end = matches[2] ? parseInt(matches[2], 10) : fileSize - 1
    return [start, end]
  }

export async function handleMediaRequest(request: { url: string; headers: { get: (arg0: string) => any } }) {
  try {
    const filePath = decodeURIComponent(request.url.replace('media://', ''))
    console.log("WOW WHAT A FILEPATH", filePath)

    if (!existsSync(filePath)) {
      return new Response(null, { status: 404, statusText: 'File Not Found' })
    }

    const stats = statSync(filePath)
    const fileSize = stats.size
    const range = request.headers.get('Range')

    const [start, end] =  range ? parseRange(range, fileSize) : [0, fileSize - 1]

    const stream = createReadStream(filePath, { start, end })
    const webStream = nodeStreamToWebStream(stream)
    const mimeType = getMimeType(filePath)

    const headers = {
      'Content-Type': mimeType,
      'Accept-Ranges': 'bytes',
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Content-Length': '0',
    }

    if (!range) {
      headers['Content-Length'] = fileSize.toString()
      return new Response(webStream, {
        status: 200,
        headers: headers
      })
    } else {
      headers['Content-Length'] = `${end - start + 1}`
      return new Response(webStream, {
        status: 206,
        headers: headers
      })
    }
  } catch (error) {
    console.error(`Error serving media file:`, error)
    return new Response(null, { status: 404, statusText: 'Not Found' })
  }
}