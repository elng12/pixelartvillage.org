#!/usr/bin/env node
const fs = require('node:fs')
const path = require('node:path')
const { translate } = require('@vitalets/google-translate-api')

const LOCALES_DIR = path.resolve('public/locales')
const CONTENT_DIR = path.resolve('src/content')
const BASE_LANG = 'en'

// 需要翻译的语言（12种缺失语言）
const MISSING_LANGUAGES = ['ar', 'tl', 'id', 'it', 'ko', 'nl', 'nb', 'pl', 'pseudo', 'sv', 'th', 'vi']

// 语言映射
const LANG_MAP = {
  ar: 'ar',
  tl: 'tl',
  id: 'id',
  it: 'it',
  ko: 'ko',
  nl: 'nl',
  nb: 'no',
  pl: 'pl',
  pseudo: 'en', // 伪语言使用英语
  sv: 'sv',
  th: 'th',
  vi: 'vi',
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function translateText(text, targetLang) {
  try {
    // 跳过已经翻译的内容
    if (!text || text.trim() === '') return text

    // 跳过HTML标签和代码块
    if (text.includes('<') && text.includes('>')) return text
    if (text.startsWith('```') || text.includes('`')) return text

    const googleLang = LANG_MAP[targetLang]
    if (!googleLang) return text

    // 对于伪语言，只添加前缀
    if (targetLang === 'pseudo') {
      return '¿' + text + '?'
    }

    const result = await translate(text, { to: googleLang })
    return result.text
  } catch (error) {
    console.log(`翻译失败: ${error.message}`)
    return text // 返回原文
  }
}

async function translateObject(obj, targetLang, path = '') {
  const result = {}

  for (const [key, value] of Object.entries(obj)) {
    const currentPath = path ? `${path}.${key}` : key

    if (typeof value === 'string') {
      // 只翻译博客相关的内容
      if (currentPath.includes('blog') || currentPath.includes('posts')) {
        console.log(`  翻译: ${currentPath}`)
        result[key] = await translateText(value, targetLang)
        await sleep(100) // 避免API限制
      } else {
        result[key] = value
      }
    } else if (typeof value === 'object' && value !== null) {
      result[key] = await translateObject(value, targetLang, currentPath)
    } else {
      result[key] = value
    }
  }

  return result
}

async function translateBlogPosts() {
  console.log('🌍 开始翻译博客内容到12种缺失语言...\n')

  // 读取英文博客内容
  const enBlogPath = path.join(CONTENT_DIR, 'blog-posts.en.json')
  if (!fs.existsSync(enBlogPath)) {
    console.log('❌ 英文博客内容文件不存在')
    return
  }

  const enBlogContent = JSON.parse(fs.readFileSync(enBlogPath, 'utf8'))

  let successCount = 0

  for (const lang of MISSING_LANGUAGES) {
    try {
      console.log(`🔄 正在翻译到 ${lang}...`)

      const targetBlogPath = path.join(CONTENT_DIR, `blog-posts.${lang}.json`)

      // 检查文件是否已存在
      let existingContent = {}
      if (fs.existsSync(targetBlogPath)) {
        try {
          existingContent = JSON.parse(fs.readFileSync(targetBlogPath, 'utf8'))
        } catch (e) {
          console.log(`  ⚠️  现有文件损坏，将重新创建`)
        }
      }

      // 翻译内容
      const translatedContent = await translateObject(enBlogContent, lang)

      // 合并现有内容（保留已翻译的部分）
      const finalContent = { ...existingContent, ...translatedContent }

      // 写入文件
      fs.writeFileSync(targetBlogPath, JSON.stringify(finalContent, null, 2), 'utf8')

      console.log(`  ✅ ${lang} 翻译完成`)
      successCount++

      // 添加延迟避免API限制
      await sleep(1000)

    } catch (error) {
      console.log(`  ❌ ${lang} 翻译失败: ${error.message}`)
    }

    console.log('')
  }

  console.log(`🎯 翻译完成！`)
  console.log(`📊 成功: ${successCount}/${MISSING_LANGUAGES.length} 种语言`)

  if (successCount > 0) {
    console.log('🔧 重新构建网站以包含翻译内容...')
    const { execSync } = require('child_process')
    try {
      execSync('npm run build', { stdio: 'inherit' })
      console.log('✅ 构建完成！')
    } catch (e) {
      console.log('⚠️  构建失败，但翻译已保存')
    }
  }
}

// 运行翻译
translateBlogPosts().catch(console.error)
