<template>
    <div class="card mb-4">
        <div class="card-header d-flex justify-content-between align-items-center">
            <h4 class="mb-0">{{ item.name }}</h4>
            <span class="badge" :class="{
                'bg-success': item.method === 'GET',
                'bg-primary': item.method === 'POST',
                'bg-warning': item.method === 'PUT',
                'bg-danger': item.method === 'DELETE'
            }">{{ item.method }}</span>
        </div>
        <div class="card-body">
            <p class="text-muted">{{ item.description }}</p>
            <div class="mb-3">
                <strong>Endpoint:</strong>
                <code class="ms-2">{{ item.path }}</code>
            </div>

            <div v-if="item.parameters && item.parameters.length > 0" class="mb-3">
                <strong>Paramètres:</strong>
                <ul class="list-group list-group-flush mt-2">
                    <li v-for="(param, index) in item.parameters" :key="index" class="list-group-item">
                        <code>{{ param.name }}</code>
                        <span class="text-muted ms-2">{{ param.type }}</span>
                        <span v-if="param.required" class="badge bg-danger ms-2">Required</span>
                        <p class="mb-0 mt-1 small">{{ param.description }}</p>
                    </li>
                </ul>
            </div>

            <div v-if="item.responses && item.responses.length > 0">
                <strong>Réponses:</strong>
                <ul class="list-group list-group-flush mt-2">
                    <li v-for="(response, index) in item.responses" :key="index" class="list-group-item">
                        <span class="badge" :class="{
                            'bg-success': response.status >= 200 && response.status < 300,
                            'bg-warning': response.status >= 300 && response.status < 400,
                            'bg-danger': response.status >= 400
                        }">{{ response.status }}</span>
                        <span class="ms-2">{{ response.description }}</span>
                        <div v-if="response.schema" class="mt-1">
                            <small class="text-muted">Schema:</small>
                            <code class="d-block mt-1 p-2 bg-light rounded">{{ response.schema }}</code>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script setup>
    defineProps({
        item: Object
    })
</script>

<style scoped>
code {
    background-color: #f8f9fa;
    padding: 2px 6px;
    border-radius: 3px;
}
</style>