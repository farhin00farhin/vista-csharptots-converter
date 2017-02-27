<template>
    <div id="ts-editor" class="editor">
        <monaco
            :code="code"
            :editorOptions="options"
            @mounted="onMounted"
        ></monaco>
    </div>
</template>

<script>
    import Monaco from 'vue-monaco-editor'
    import TSPoco from 'typescript-cs-poco'

    export default {
        data(){
            return {
                code: '// TypeScript Code Review \n',
                options: {
                    selectOnLineNumbers: false,
                    readOnly: true
                }
            }
        },
        components: { Monaco },
        mounted(){
            Event.listen('transpile.to.ts', code => {
                this.editor.setValue(TSPoco(code))
            })
        },
        methods: {
            onMounted(editor){
                this.editor = editor;
            }
        }
    }
</script>

<style>
    #ts-editor {
        border-left: 1px solid rgb(134, 134, 134);
    }
</style>