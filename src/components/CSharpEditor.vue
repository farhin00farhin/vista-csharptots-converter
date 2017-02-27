<template>
    <div id="csharp-editor" class="editor">
        <monaco
            language="csharp"
            :code="code"
            @mounted="onMounted"
            @codeChange="onCodeChange"
        ></monaco>
    </div>
</template>

<script>
    import Monaco from 'vue-monaco-editor'
    import { debounce } from 'lodash'

    export default {
        data(){
            return {
                code: '// Paste your CSharp code here \n'
            }
        },
        components: { Monaco },
        methods: {
            onCodeChange: debounce(e => {
                Event.fire('transpile.to.ts', e.getValue())
            }, 300),
            onMounted(editor){
                this.editor = editor
            }
        }
    }
</script>