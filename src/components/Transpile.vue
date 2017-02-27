<template>
    <div class="editors">
        <csharp-editor
            @codeChange="transpileToTs"
        ></csharp-editor>
        <ts-editor
           :code="code"
        ></ts-editor>
    </div>
</template>

<script>
    import csharpEditor from './CSharpEditor'
    import tsEditor from './TSEditor'

    export default {
        data(){
            return {
                code: '//'
            }
        },
        components: { csharpEditor, tsEditor },
        methods: {
            transpileToTs(code){
                this.code = code;
            }
        }
    }
</script>

<style>
    .editor {
        float: left;
        width: 49.5%;
        height: 100%;
    }

    .editors {
        height: 100%
    }
</style>
