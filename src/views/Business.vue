<template>
    <div class="business-list">
        <div v-for="item in businessList" :key="item.businessId" class="business-item">
            <h3>{{item.businessName}}（云南大学店）</h3>

        </div>
    </div>
</template> 