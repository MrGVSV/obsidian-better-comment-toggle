interface LanguageData {
	commentStart: string;
	commentEnd: string;
}

// This is a subset of the ones listed here: https://prismjs.com/#supported-languages
// (since Obsidian uses PrismJS for syntax highlighting).
// If you want to add a language, please open a PR.
const languages = {
	applescript: {
		commentStart: '--',
		commentEnd: '',
	},
	arduino: {
		commentStart: '//',
		commentEnd: '',
	},
	bash: {
		commentStart: '#',
		commentEnd: '',
	},
	basic: {
		commentStart: "'",
		commentEnd: '',
	},
	c: {
		commentStart: '//',
		commentEnd: '',
	},
	cpp: {
		commentStart: '//',
		commentEnd: '',
	},
	csharp: {
		commentStart: '//',
		commentEnd: '',
	},
	cs: {
		commentStart: '//',
		commentEnd: '',
	},
	css: {
		commentStart: '/*',
		commentEnd: '*/',
	},
	d: {
		commentStart: '//',
		commentEnd: '',
	},
	dart: {
		commentStart: '//',
		commentEnd: '',
	},
	elixir: {
		commentStart: '#',
		commentEnd: '',
	},
	elm: {
		commentStart: '--',
		commentEnd: '',
	},
	erlang: {
		commentStart: '%',
		commentEnd: '',
	},
	fsharp: {
		commentStart: '//',
		commentEnd: '',
	},
	gdscript: {
		commentStart: '#',
		commentEnd: '',
	},
	glsl: {
		commentStart: '//',
		commentEnd: '',
	},
	go: {
		commentStart: '//',
		commentEnd: '',
	},
	gradle: {
		commentStart: '//',
		commentEnd: '',
	},
	graphql: {
		commentStart: '#',
		commentEnd: '',
	},
	groovy: {
		commentStart: '//',
		commentEnd: '',
	},
	haskell: {
		commentStart: '--',
		commentEnd: '',
	},
	hs: {
		commentStart: '--',
		commentEnd: '',
	},
	html: {
		commentStart: '<!--',
		commentEnd: '-->',
	},
	java: {
		commentStart: '//',
		commentEnd: '',
	},
	javascript: {
		commentStart: '//',
		commentEnd: '',
	},
	js: {
		commentStart: '//',
		commentEnd: '',
	},
	jsx: {
		commentStart: '//',
		commentEnd: '',
	},
	// Technically not allowed, but we'll provide it anyway
	json: {
		commentStart: '//',
		commentEnd: '',
	},
	julia: {
		commentStart: '#',
		commentEnd: '',
	},
	kotlin: {
		commentStart: '//',
		commentEnd: '',
	},
	kt: {
		commentStart: '//',
		commentEnd: '',
	},
	latex: {
		commentStart: '%',
		commentEnd: '',
	},
	less: {
		commentStart: '/*',
		commentEnd: '*/',
	},
	lisp: {
		commentStart: ';',
		commentEnd: '',
	},
	lua: {
		commentStart: '--',
		commentEnd: '',
	},
	markdown: {
		commentStart: '<!--',
		commentEnd: '-->',
	},
	md: {
		commentStart: '<!--',
		commentEnd: '-->',
	},
	mermaid: {
		commentStart: '%%',
		commentEnd: '',
	},
	nim: {
		commentStart: '#',
		commentEnd: '',
	},
	objc: {
		commentStart: '//',
		commentEnd: '',
	},
	objectivec: {
		commentStart: '//',
		commentEnd: '',
	},
	pascal: {
		commentStart: '//',
		commentEnd: '',
	},
	perl: {
		commentStart: '#',
		commentEnd: '',
	},
	php: {
		commentStart: '//',
		commentEnd: '',
	},
	protobuf: {
		commentStart: '//',
		commentEnd: '',
	},
	python: {
		commentStart: '#',
		commentEnd: '',
	},
	py: {
		commentStart: '#',
		commentEnd: '',
	},
	r: {
		commentStart: '#',
		commentEnd: '',
	},
	rb: {
		commentStart: '#',
		commentEnd: '',
	},
	ruby: {
		commentStart: '#',
		commentEnd: '',
	},
	rust: {
		commentStart: '//',
		commentEnd: '',
	},
	sass: {
		commentStart: '/*',
		commentEnd: '*/',
	},
	scala: {
		commentStart: '//',
		commentEnd: '',
	},
	scss: {
		commentStart: '/*',
		commentEnd: '*/',
	},
	sh: {
		commentStart: '#',
		commentEnd: '',
	},
	shell: {
		commentStart: '#',
		commentEnd: '',
	},
	smalltalk: {
		commentStart: '"',
		commentEnd: '"',
	},
	sql: {
		commentStart: '--',
		commentEnd: '',
	},
	swift: {
		commentStart: '//',
		commentEnd: '',
	},
	toml: {
		commentStart: '#',
		commentEnd: '',
	},
	ts: {
		commentStart: '//',
		commentEnd: '',
	},
	tsx: {
		commentStart: '//',
		commentEnd: '',
	},
	typescript: {
		commentStart: '//',
		commentEnd: '',
	},
	wasm: {
		commentStart: ';;',
		commentEnd: '',
	},
	wgsl: {
		commentStart: '//',
		commentEnd: '',
	},
	xml: {
		commentStart: '<!--',
		commentEnd: '-->',
	},
	yaml: {
		commentStart: '#',
		commentEnd: '',
	},
	yml: {
		commentStart: '#',
		commentEnd: '',
	},
	zig: {
		commentStart: '//',
		commentEnd: '',
	},
} satisfies Record<string, LanguageData>;

export const Languages = new Map<string, LanguageData>(Object.entries(languages));
