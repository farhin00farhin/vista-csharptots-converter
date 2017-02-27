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

    export default {
        data(){
            return {
                code: '// Paste your CSharp code here \n'
            }
        },
        components: { Monaco },
        methods: {
            onCodeChange(editor){
                Event.fire('transpile.to.ts', editor.getValue())
            },
            onMounted(editor){
                this.editor = editor
            }
        }
    }
</script>